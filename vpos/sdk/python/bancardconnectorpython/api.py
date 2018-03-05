# MIT License
#
# Copyright (c) [2018] [Victor Manuel Cajes Gonzalez - vcajes@gmail.com]
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.


import os
import json
import hashlib
import requests
from bancardconnectorpython.constants import *
from bancardconnectorpython.util import *
from bancardconnectorpython.exceptions import *


class BancardAPI(object):

	def __init__(self, options=None, **kwargs):
		"""
			Constructor of the BancardAPI class.

			:param options: Dictionary with configuration parameters for the API
				:type options: dict
			:param kwargs: Dictionary with any extra parameters that could be unpacked for the API. The required values are:
				* environment: sandbox or production
				* public_key: the public key given by Bancard
				* private_key: the private key given by Bancard
				:type kwargs: dict
			:raises BancardAPIConfigurationException: if the merge of options and kwargs does not contains the keys: environment public_key private_key
		"""

		try:
			self.options = merge_dict(options or {}, kwargs)
			self.environment = self.options.get("environment", ENVIRONMENT_SANDBOX)  # by default the sandbox environment
			self.public_key = self.options["public_key"]  # mandatory, raise exception if missing
			self.private_key = self.options["private_key"]  # mandatory, raise exception if missing
			self.urls = BANCARD_URLS[self.environment]
		except (KeyError, ValueError, TypeError):
			raise BancardAPIConfigurationException("The configuration parameters for the BancardAPI are not valid.")

	@staticmethod
	def __call_bancard_webservice(params, wsurl):
		"""
			Sends the JSON params object to the WSURL of Bancard and returns the JSON parsed response
			:param params: values to send to the Bancard API
			:param wsurl: URL of the Bancard WebService
			:return the JSON object obtained after parsing the Bancard response
		"""
		bancard_body_request = json.dumps(params) if type(params) is dict else (params if type(params) is str else str(params))
		headers = {"Content-Type": "application/json"}
		response = requests.post(wsurl, data=bancard_body_request, headers=headers)
		bancard_response = json.loads(response.content.decode("utf-8")) if response.content else dict()
		return bancard_response

	@staticmethod
	def validate_marketplace_charge_id(marketplace_charge_id):
		"""
			Validates that the marketplace_charge_id can be converted to an integer value (as required by the Bancard docs)
			:param marketplace_charge_id: values to send to the Bancard API
			:raises BancardAPIInvalidParameterException: if the marketplace_charge_id does not contains a valid value
		"""

		try:
			int(marketplace_charge_id)
		except (TypeError, ValueError):
			raise BancardAPIInvalidParameterException("The marketplace charge ID is required and must be a valid integer.")

	@staticmethod
	def validate_currency(currency):
		"""
			Validates that the currency belong to the allowed ones by Bancard (as required by the Bancard docs)
			:param currency: values to send to the Bancard API
			:raises BancardAPIInvalidParameterException: if the currency does not contains a valid value
		"""
		if type(currency) is not str or currency not in BANCARD_ALLOWED_CURRENCIES:
			raise BancardAPIInvalidParameterException("The currency must be any of the following strings: %s" % BANCARD_ALLOWED_CURRENCIES)

	@staticmethod
	def validate_amount(amount):
		"""
			Validates that the amount is a Decimal object greater than zero (as required by the Bancard docs)
			:param amount: values to send to the Bancard API
			:raises BancardAPIInvalidParameterException: if the amount does not contains a valid value
		"""
		if not isinstance(amount, Decimal) or amount <= Decimal(0):
			raise BancardAPIInvalidParameterException("The amount must be a decimal greater than Decimal(0).")

	@staticmethod
	def validate_description(description):
		"""
			Validates that the description has a minimum/maximum length (as required by the Bancard docs)
			:param description: values to send to the Bancard API
			:raises BancardAPIInvalidParameterException: if the description does not contains a valid value
		"""
		if type(description) is not str or not 0 <= len(description) <= 20:
			raise BancardAPIInvalidParameterException("The description must be a string between [0,20] characters.")

	@staticmethod
	def validate_approved_url(approved_url):
		"""
			Validates that the approved_url has a maximum length (as required by the Bancard docs)
			:param approved_url: values to send to the Bancard API
			:raises BancardAPIInvalidParameterException: if the approved_url does not contains a valid value
		"""
		if type(approved_url) is not str or not 1 <= len(approved_url) <= 255:
			raise BancardAPIInvalidParameterException("The approved_url must be a valid URL string containing [1,255] characters.")

	@staticmethod
	def validate_cancelled_url(cancelled_url):
		"""
			Validates that the cancelled_url has a maximum length (as required by the Bancard docs)
			:param cancelled_url: values to send to the Bancard API
			:raises BancardAPIInvalidParameterException: if the cancelled_url does not contains a valid value
		"""
		if type(cancelled_url) is not str or not 1 <= len(cancelled_url) <= 255:
			raise BancardAPIInvalidParameterException("The cancelled_url must be a valid URL string containing [1,255] characters.")

	def generate_charge_token(self, marketplace_charge_id, amount, description, approved_url, cancelled_url, currency="PYG"):
		"""
			Generates a Bancard Proces ID Token so the end-user payer could pay later.

			:param marketplace_charge_id: The marketplace's custom ID of this charge request
				:type marketplace_charge_id: int or str
			:param amount: The amount that the payer should pay
				:type amount: Decimal
			:param description: The text message that the payer will se while making the payment
				:type description: str
			:param approved_url: The URL to which Bancard will redirect to the payer after the payer sucessfully completes the payment
				:type approved_url: str
			:param cancelled_url: The URL to which Bancard will redirect to the payer when the payment is not completed successfully for some reason
				:type cancelled_url: str
			:param currency: The currency of the amount to charge in the format ISO-4217
				:type currency: str
			:return: a tuple of: bancard_process_id, payment_url, bancard_response
				:rtype tuple (str, str, dict)
			:raises BancardAPIInvalidParameterException: if any of the input parameters is not valid
			:raises BancardAPIMarketplaceChargeIDAlreadyExistsException: if there is already another charge request in Bancard with the same marketplace_charge_id
			:raises BancardAPIChargeRejectedException: if Bancard rejected the process id generation request
		"""

		BancardAPI.validate_marketplace_charge_id(marketplace_charge_id)
		BancardAPI.validate_amount(amount)
		BancardAPI.validate_description(description)
		BancardAPI.validate_approved_url(approved_url)
		BancardAPI.validate_cancelled_url(cancelled_url)
		BancardAPI.validate_currency(currency)

		amount_str = "%s.00" % currency_decimal_to_string(currency, amount)

		bancard_token = "%s%s%s%s" % (self.private_key, marketplace_charge_id, amount_str, currency)
		if is_python_version_greater_igual_than_3x():
			bancard_token = bytes(bancard_token, "UTF-8")

		bancard_body_request = {
			"public_key": self.public_key,
			"operation": {
				"token": hashlib.md5(bancard_token).hexdigest(),
				"shop_process_id": str(marketplace_charge_id),
				"currency": currency,
				"amount": amount_str,
				"additional_data": "",
				"description": description,
				"return_url": approved_url,
				"cancel_url": cancelled_url
			}
		}

		bancard_response = BancardAPI.__call_bancard_webservice(bancard_body_request, self.urls[CHARGE_TOKEN_GENERATOR_KEY])
		if bancard_response.get("status", None) == "success":
			# build the payment URL that should be opener to the payer
			bancard_process_id = str(bancard_response["process_id"])
			payment_url = "%s%s" % (self.urls[PAYMENT_WEB_URL_KEY], bancard_process_id)

			# return the bancard_process_id, payment_url and the full bancard json response
			return bancard_process_id, payment_url, bancard_response

		# in any other case Bancard did not create the charge process ID
		bancard_msg_key, bancard_msg_error = "[NoBancardErrorKey]", "[NoBancardErrorMessage]"
		bancard_tx_messages = bancard_response.get('messages', list())
		if type(bancard_tx_messages) is list:
			for bancard_msg_item in bancard_tx_messages:
				bancard_msg_key = bancard_msg_item.get("key", "[NoErrorKey]")
				bancard_msg_error = bancard_msg_item.get("dsc", "[NoBancardErrorMessage]")

				# check if the error was due to a repeated marketplace charge ID
				if bancard_msg_key == 'InvalidOperationError' and "process has already been taken" in bancard_msg_error:
					raise BancardAPIMarketplaceChargeIDAlreadyExistsException(
						"The marketplace charge ID %s already exists in Bancard. Check the charge status with the Bancard CONFIRMATION WebService." % marketplace_charge_id, bancard_response)

		# by default the charge process id was not generated by bancard
		raise BancardAPIChargeRejectedException(bancard_msg_error, bancard_response)

	def get_charge_status(self, marketplace_charge_id, amount, currency="PYG"):
		"""
			Calls to the confirmations Bancard WebService to check the status of the charge request in order to know if it is pending/payed/rejected/rolledback.

			:param marketplace_charge_id: The marketplace's custom ID of this charge request
				:type marketplace_charge_id: int or str
			:param amount: The amount that the payer should pay
				:type amount: Decimal
			:param currency: The currency of the amount to charge in the format ISO-4217
				:type currency: str
			:return: a tuple of: already_payed, authorization_number, bancard_response
				:rtype tuple (bool, str, dict)
			:raises BancardAPIInvalidParameterException: if any of the input parameters is not valid
			:raises BancardAPIChargeInconsistentValuesException: if the payment of marketplace_charge_id has been payed but does not match the currency/amount parameters
			:raises BancardAPIPaymentMethodNotEnabledException: if Bancard rejeted the payment because the payer's payment method was not enabled for making payments
			:raises BancardAPIPaymentTransactionInvalidException: if the payment has been rejected by Bancard because the transaction was not valid for some reason
			:raises BancardAPIPaymentMethodNotEnoughFundsException: if the payment has been rejected by Bancard because the payment method did not have enough funds
			:raises BancardAPIPaymentRejectecUnknownReasonException: if the payment has been rejected by Bancard due to an unhandled/unknown reason
		"""

		BancardAPI.validate_marketplace_charge_id(marketplace_charge_id)
		BancardAPI.validate_amount(amount)
		BancardAPI.validate_currency(currency)

		amount_str = "%s.00" % currency_decimal_to_string(currency, amount)

		bancard_token = "%s%s%s" % (self.private_key, marketplace_charge_id, "get_confirmation")
		if is_python_version_greater_igual_than_3x():
			bancard_token = bytes(bancard_token, "UTF-8")

		bancard_body_request = {
			"public_key": self.public_key,
			"operation": {
				"token": hashlib.md5(bancard_token).hexdigest(),
				"shop_process_id": marketplace_charge_id
			}
		}

		bancard_response = BancardAPI.__call_bancard_webservice(bancard_body_request, self.urls[CONFIRMATIONS_KEY])
		if bancard_response.get("status", None) == "success":
			confirmation = bancard_response.get("confirmation", dict())
			response_code = confirmation.get("response_code", None)
			if response_code == '00':
				if Decimal(confirmation["amount"]) == Decimal(amount_str) and confirmation["currency"] == currency:
					return True, confirmation.get("authorization_number", None), bancard_response
				else:
					# this marketplace charge id was found in Bancard but is has another amount/currency
					raise BancardAPIChargeInconsistentValuesException("Duplicated charge ID %s in Bancard rejected due to inconsistency in amount/currency", bancard_response)
			else:
				# check if a specific error message has been received
				if response_code in ['05', '15']:
					raise BancardAPIPaymentMethodNotEnabledException("Bancard reported that the payer's payment method was not enabled for making payments.", bancard_response)
				elif response_code == '12':
					raise BancardAPIPaymentTransactionInvalidException("Bancard reported that the transaction is not valid.", bancard_response)
				elif response_code == '51':
					raise BancardAPIPaymentMethodNotEnoughFundsException("Bancard reported that your payment card does not have enough funds.", bancard_response)

				raise BancardAPIPaymentRejectecUnknownReasonException("Bancard reported that the payment has been rejected.", bancard_response)

		bancard_tx_messages = bancard_response.get('messages')[0]
		if bancard_tx_messages.get("key", None) == 'PaymentNotFoundError':
			# remember that you, as a marketplace, should rollback this transaction if the payer did not confirm this payment within 10 minutes
			return False, None, bancard_response

		# by default you can assume that the transaction has been rejected
		raise BancardAPIPaymentRejectecUnknownReasonException("Bancard reported that the payment has been rejected: %s" % bancard_tx_messages.get("dsc", ""), bancard_response)

	def rollback_charge(self, marketplace_charge_id, amount, currency="PYG"):
		"""
			Calls to the rollback Bancard WebService to rollback a given charge request.

			:param marketplace_charge_id: The marketplace's custom ID of this charge request
				:type marketplace_charge_id: int or str
			:param amount: The amount that the payer should pay
				:type amount: Decimal
			:param currency: The currency of the amount to charge in the format ISO-4217
				:type currency: str
			:return: a tuple of: successfull_rollback, bancard_response
				:rtype tuple (bool, dict)
			:raises BancardAPIInvalidParameterException: if any of the input parameters is not valid
			:raises BancardAPINotRolledBackException: if Bancard denied the rollback request for some reason (i.e.: already couponned)
		"""

		BancardAPI.validate_marketplace_charge_id(marketplace_charge_id)
		BancardAPI.validate_amount(amount)
		BancardAPI.validate_currency(currency)

		amount_str = "%s.00" % currency_decimal_to_string(currency, amount)

		bancard_token = "%s%s%s%s" % (self.private_key, marketplace_charge_id, "rollback", amount_str)
		if is_python_version_greater_igual_than_3x():
			bancard_token = bytes(bancard_token, "UTF-8")

		bancard_body_request = {
			"public_key": self.public_key,
			"operation": {
				"token": hashlib.md5(bancard_token).hexdigest(),
				"shop_process_id": marketplace_charge_id
			}
		}

		bancard_response = BancardAPI.__call_bancard_webservice(bancard_body_request, self.urls[ROLLBACK_KEY])

		bancard_tx_status = bancard_response.get("status", "")
		if bancard_tx_status == "success":
			# the bancard payment was rolled-back successfuly
			return True, bancard_response

		bancard_tx_messages = bancard_response.get('messages')[0]
		if bancard_tx_messages.get("key") in ['PaymentNotFoundError']:
			# the bancard charge has never been payed, but anyways Bancard rolled-back it successfully
			return True, bancard_response

		# bancard was not able to roll-back the payment
		raise BancardAPINotRolledBackException("Bancard was not able to roll-back the payment: %s" % bancard_tx_messages.get("dsc", ""), bancard_response)

	def process_vpos_webhook(self, bancard_data, original_marketplace_charge_id, original_amount, original_currency="PYG"):
		"""
			Manage the webhook data received from the Bancard VPOS after a successfull/rejected payment from the end-user

			:param bancard_data: The full content received in the Bancard wehbook
				:type bancard_data: str or dict
			:param original_marketplace_charge_id: The marketplace's custom ID of this charge request
				:type original_marketplace_charge_id: int or str
			:param original_amount: The amount that the payer should pay
				:type original_amount: Decimal
			:param original_currency: The currency of the amount to charge in the format ISO-4217
				:type original_currency: str
			:return: a tuple of: successfull_rollback, bancard_response
				:rtype tuple (bool, dict)
			:raises BancardAPIInvalidParameterException: if any of the input parameters is not valid
			:raises BancardAPIInvalidWebhookDataException: if the webhook data is not how it is supposed to be (someone might be trying to hack you)
			:raises BancardAPIInvalidWebhookTokenException: if the token generated as the specs is not equal to the one that Bancard sent (someone might be trying to hack you)
			:raises BancardAPIPaymentMethodNotEnabledException: if Bancard rejeted the payment because the payer's payment method was not enabled for making payments
			:raises BancardAPIPaymentTransactionInvalidException: if the payment has been rejected by Bancard because the transaction was not valid for some reason
			:raises BancardAPIPaymentMethodNotEnoughFundsException: if the payment has been rejected by Bancard because the payment method did not have enough funds
			:raises BancardAPIPaymentRejectecUnknownReasonException: if the payment has been rejected by Bancard due to an unhandled/unknown reason
		"""

		BancardAPI.validate_marketplace_charge_id(original_marketplace_charge_id)
		BancardAPI.validate_amount(original_amount)
		BancardAPI.validate_currency(original_currency)

		try:
			# parse the data received by Bancard
			bancard_operation_data = json.loads(bancard_data) if type(bancard_data) is str else bancard_data
			bancard_operation = bancard_operation_data["operation"]
			marketplace_charge_id = bancard_operation["shop_process_id"]

			if str(marketplace_charge_id) != str(original_marketplace_charge_id):
				raise BancardAPIInvalidWebhookDataException("Invalid Bancard webhook data.", bancard_data)

			# validate the token received by bancard
			amount_str = "%s.00" % currency_decimal_to_string(original_currency, original_amount)

			required_bancard_token = "%s%s%s%s%s" % (self.private_key, original_marketplace_charge_id, "confirm", amount_str, original_currency)
			if is_python_version_greater_igual_than_3x():
				required_bancard_token = bytes(required_bancard_token, "UTF-8")

			if bancard_operation["token"] != required_bancard_token:
				raise BancardAPIInvalidWebhookTokenException("The Bancard Webhook did not pass the token validation: %s != %s" % (bancard_operation["token"], required_bancard_token))

			# check the status of the Bancard transaction
			if bancard_operation["response_code"] == '00':
				return True, bancard_operation["authorization_number"], bancard_data
			else:
				# check if a specific error message has been received
				if bancard_operation["response_code"] in ['05', '15']:
					raise BancardAPIPaymentMethodNotEnabledException("Bancard reported that the payer's payment method was not enabled for making payments.", bancard_data)
				elif bancard_operation["response_code"] == '12':
					raise BancardAPIPaymentTransactionInvalidException("Bancard reported that the transaction is not valid.", bancard_data)
				elif bancard_operation["response_code"] == '51':
					raise BancardAPIPaymentMethodNotEnoughFundsException("Bancard reported that your payment card does not have enough funds.", bancard_data)

			raise BancardAPIPaymentRejectecUnknownReasonException("Bancard reported that the payment has been rejected.", bancard_data)
		except:
			raise BancardAPIInvalidWebhookDataException("Invalid Bancard webhook data.", bancard_data)

	@staticmethod
	def get_marketplace_charge_id_from_bancard_webhook(bancard_data):
		"""
			Obtains the marketplace_charge_id from the data received in the Bancard webhook.
			This method could be useful to get your charge object from your DB

			:param bancard_data: The json data received by the bancard webhook
				:type bancard_data: str or dict
			:return: the marketplace charge id
				:rtype str
			:raises BancardAPIInvalidWebhookDataException: if there was a problem while parsing the Bancard webhook data (someone might be trying to hack you)
		"""

		try:
			# parse the data received by Bancard
			bancard_operation_data = json.loads(bancard_data) if type(bancard_data) is str else bancard_data
			bancard_operation = bancard_operation_data["operation"]
			marketplace_charge_id = bancard_operation["shop_process_id"]
			return str(marketplace_charge_id)
		except:
			raise BancardAPIInvalidWebhookDataException("Invalid Bancard webhook data.", bancard_data)


__api__ = None


def connector():
	"""
		Returns the global BancardAPI. If there is no API yet, create one by using the OS environment variables.
		The OS environment variables that should be configured are:
			BANCARD_ENVIRONMENT: "sandbox" or "production"
			BANCARD_PUBLIC_KEY: your_bancard_marketplace_public_key
			BANCARD_PRIVATE_KEY: your_bancard_marketplace_private_key

		:return: the marketplace charge id
			:rtype str
		:raises BancardAPIConfigurationException: if there was not a default api yet, and any of the required OS environment variables were missing
	"""

	global __api__
	if __api__ is None:
		try:
			environment = os.environ.get("BANCARD_ENVIRONMENT", ENVIRONMENT_SANDBOX)  # possible values: ["sandbox", "production"], and by default "sandbox"
			public_key = os.environ["BANCARD_PUBLIC_KEY"]
			private_key = os.environ["BANCARD_PRIVATE_KEY"]
		except KeyError:
			raise BancardAPIConfigurationException("The BancardAPI requires the following OS environment variables: BANCARD_ENVIRONMENT BANCARD_PUBLIC_KEY BANCARD_PRIVATE_KEY")

		# creates the BancardAPI reference to the global variable __api__
		__api__ = BancardAPI(environment=environment, public_key=public_key, private_key=private_key)
	return __api__


def set_config(options=None, **config):
	"""
		Create new BancardAPI object with the given configuration parameters.

		:param options: Dictionary with configuration parameters for the API
				:type options: dict
		:param config: Dictionary with any extra parameters that could be unpacked for the API. The required values are:
			* environment: sandbox or production
			* public_key: the public key given by Bancard
			* private_key: the private key given by Bancard
			:type config: dict
		:return: the reference to the just created BancardAPI instance
			:rtype str
		:raises BancardAPIConfigurationException: if the BancardAPI couldn't be created due to missing configuration parameters
	"""

	global __api__
	__api__ = BancardAPI(options or dict(), **config)
	return __api__


configure = set_config
