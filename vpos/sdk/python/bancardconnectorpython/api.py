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
from bancardconnectorpython.util import *
from bancardconnectorpython.exceptions import *


class BancardAPI(object):
	# possibles values for the environment class member
	ENVIRONMENT_SANDBOX = "sandbox"
	ENVIRONMENT_PRODUCTION = "production"

	# currently PYG is the only allowed currency for Bancard
	BANCARD_ALLOWED_CURRENCIES = ["PYG"]

	# URL keys
	ROLLBACK_KEY = "rollback"
	CHARGE_TOKEN_GENERATOR_KEY = "single_buy"
	PAYMENT_WEB_URL_KEY = "payment"
	CONFIRMATIONS_KEY = "confirmation"

	BANCARD_BASE_URL_SANDBOX = "https://vpos.infonet.com.py:8888"
	BANCARD_BASE_URL_PRODUCTION = "https://vpos.infonet.com.py"

	SANDBOX_URLS = {
		ROLLBACK_KEY: "%s/vpos/api/0.3/single_buy/rollback" % BANCARD_BASE_URL_SANDBOX,
		CHARGE_TOKEN_GENERATOR_KEY: "%s/vpos/api/0.3/single_buy" % BANCARD_BASE_URL_SANDBOX,
		PAYMENT_WEB_URL_KEY: "%s/payment/single_buy?process_id=" % BANCARD_BASE_URL_SANDBOX,
		CONFIRMATIONS_KEY: "%s/vpos/api/0.3/single_buy/confirmations" % BANCARD_BASE_URL_SANDBOX,
	}

	PRODUCTION_URLS = {
		ROLLBACK_KEY: "%s/vpos/api/0.3/single_buy/rollback" % BANCARD_BASE_URL_PRODUCTION,
		CHARGE_TOKEN_GENERATOR_KEY: "%s/vpos/api/0.3/single_buy" % BANCARD_BASE_URL_PRODUCTION,
		PAYMENT_WEB_URL_KEY: "%s/payment/single_buy?process_id=" % BANCARD_BASE_URL_PRODUCTION,
		CONFIRMATIONS_KEY: "%s/vpos/api/0.3/single_buy/confirmations" % BANCARD_BASE_URL_PRODUCTION,
	}

	BANCARD_URLS = {
		ENVIRONMENT_SANDBOX: SANDBOX_URLS,
		ENVIRONMENT_PRODUCTION: PRODUCTION_URLS
	}

	def __init__(self, options=None, **kwargs):
		self.options = merge_dict(options or {}, kwargs)
		self.environment = self.options.get("environment", BancardAPI.ENVIRONMENT_SANDBOX)  # by default the sandbox environment
		self.public_key = self.options["public_key"]  # mandatory, raise exception if missing
		self.private_key = self.options["private_key"]  # mandatory, raise exception if missing
		self.urls = BancardAPI.BANCARD_URLS[self.environment]

	@staticmethod
	def __call_bancard_webservice(params, wsurl):
		bancard_body_request = json.dumps(params) if type(params) is dict else (params if type(params) is str else str(params))
		headers = {"Content-Type": "application/json"}
		response = requests.post(wsurl, data=bancard_body_request, headers=headers)
		bancard_response = json.loads(response.content.decode("utf-8")) if response.content else dict()
		return bancard_response

	@staticmethod
	def validate_marketplace_charge_id(marketplace_charge_id):
		try:
			int(marketplace_charge_id)
		except:
			raise BancardAPIInvalidParameterException("The marketplace charge ID is required and must be a valid integer.")

	@staticmethod
	def validate_currency(currency):
		if type(currency) is not str or currency not in BancardAPI.BANCARD_ALLOWED_CURRENCIES:
			raise BancardAPIInvalidParameterException("The currency must be any of the following strings: %s" % BancardAPI.BANCARD_ALLOWED_CURRENCIES)

	@staticmethod
	def validate_amount(amount):
		if not isinstance(amount, Decimal) or amount <= Decimal(0):
			raise BancardAPIInvalidParameterException("The amount must be a decimal greater than Decimal(0).")

	@staticmethod
	def validate_description(description):
		if type(description) is not str or not 0 <= len(description) <= 20:
			raise BancardAPIInvalidParameterException("The description must be a string between [0,20] characters.")

	@staticmethod
	def validate_approved_url(approved_url):
		if type(approved_url) is not str or not 1 <= len(approved_url) <= 255:
			raise BancardAPIInvalidParameterException("The approved_url must be a valid URL string containing [1,255] characters.")

	@staticmethod
	def validate_cancelled_url(cancelled_url):
		if type(cancelled_url) is not str or not 1 <= len(cancelled_url) <= 255:
			raise BancardAPIInvalidParameterException("The cancelled_url must be a valid URL string containing [1,255] characters.")

	def generate_charge_token(self, marketplace_charge_id, amount, description, approved_url, cancelled_url, currency="PYG"):
		BancardAPI.validate_marketplace_charge_id(marketplace_charge_id)
		BancardAPI.validate_amount(amount)
		BancardAPI.validate_description(description)
		BancardAPI.validate_approved_url(approved_url)
		BancardAPI.validate_cancelled_url(cancelled_url)
		BancardAPI.validate_currency(currency)

		amount_str = "%s.00" % currency_decimal_to_string(currency, amount)
		bancard_body_request = {
			"public_key": self.public_key,
			"operation": {
				"token": hashlib.md5(bytes("%s%s%s%s" % (self.private_key, marketplace_charge_id, amount_str, currency), "UTF-8")).hexdigest(),
				"shop_process_id": str(marketplace_charge_id),
				"currency": currency,
				"amount": amount_str,
				"additional_data": "",
				"description": description,
				"return_url": approved_url,
				"cancel_url": cancelled_url
			}
		}

		bancard_response = BancardAPI.__call_bancard_webservice(bancard_body_request, self.urls[BancardAPI.CHARGE_TOKEN_GENERATOR_KEY])
		if bancard_response.get("status", None) == "success":
			# construct the payment URL that should be opener to the payer
			bancard_process_id = str(bancard_response["process_id"])
			payment_url = "%s%s" % (self.urls[BancardAPI.PAYMENT_WEB_URL_KEY], bancard_process_id)

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
		BancardAPI.validate_marketplace_charge_id(marketplace_charge_id)
		BancardAPI.validate_amount(amount)
		BancardAPI.validate_currency(currency)

		amount_str = "%s.00" % currency_decimal_to_string(currency, amount)
		bancard_body_request = {
			"public_key": self.public_key,
			"operation": {
				"token": hashlib.md5(bytes("%s%s%s" % (self.private_key, marketplace_charge_id, "get_confirmation"), "UTF-8")).hexdigest(),
				"shop_process_id": marketplace_charge_id
			}
		}

		bancard_response = BancardAPI.__call_bancard_webservice(bancard_body_request, self.urls[BancardAPI.CONFIRMATIONS_KEY])
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
		BancardAPI.validate_marketplace_charge_id(marketplace_charge_id)
		BancardAPI.validate_amount(amount)
		BancardAPI.validate_currency(currency)

		amount_str = "%s.00" % currency_decimal_to_string(currency, amount)
		bancard_body_request = {
			"public_key": self.public_key,
			"operation": {
				"token": hashlib.md5(bytes("%s%s%s%s" % (self.private_key, marketplace_charge_id, "rollback", amount_str), "UTF-8")).hexdigest(),
				"shop_process_id": marketplace_charge_id
			}
		}

		bancard_response = BancardAPI.__call_bancard_webservice(bancard_body_request, self.urls[BancardAPI.ROLLBACK_KEY])

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

	def validate_vpos_webhook(self, bancard_data, original_marketplace_charge_id, original_amount, original_currency="PYG"):
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
			required_bancard_token = hashlib.md5(bytes("%s%s%s%s%s" % (self.private_key, original_marketplace_charge_id, "confirm", amount_str, original_currency), "UTF-8")).hexdigest()
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
		try:
			# parse the data received by Bancard
			bancard_operation_data = json.loads(bancard_data) if type(bancard_data) is str else bancard_data
			bancard_operation = bancard_operation_data["operation"]
			marketplace_charge_id = bancard_operation["shop_process_id"]
			return marketplace_charge_id
		except:
			raise BancardAPIInvalidWebhookDataException("Invalid Bancard webhook data.", bancard_data)


__api__ = None


@property
def connector():
	""" Returns the global BancardAPI. If there is no API yet, create one by using the OS environment variables. """
	global __api__
	if __api__ is None:
		try:
			environment = os.environ.get("BANCARD_ENVIRONMENT", BancardAPI.ENVIRONMENT_SANDBOX)  # possible values: ["sandbox", "production"], and by default "sandbox"
			public_key = os.environ["BANCARD_PUBLIC_KEY"]
			private_key = os.environ["BANCARD_PRIVATE_KEY"]
		except KeyError:
			raise BancardAPIConfigurationException("The BancardAPI requires the following \
				OS environment variables: BANCARD_ENVIRONMENT BANCARD_PUBLIC_KEY BANCARD_PRIVATE_KEY")

		__api__ = BancardAPI(environment=environment, public_key=public_key, private_key=private_key)
	return __api__


def set_config(options=None, **config):
	""" Create new BancardAPI object with the given configuration """
	global __api__
	__api__ = BancardAPI(options or dict(), **config)
	return __api__


configure = set_config
