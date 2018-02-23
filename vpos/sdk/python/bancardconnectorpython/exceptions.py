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


class BancardAPIException(Exception):
	def __init__(self, msg="", data=None):
		"""
			Constructor of the BancardAPIException.

			:param msg: one dictionary
				:type msg: str
			:param data: any type of data to be passed in the exception. Typically would be a dict.
				:type data: dict
		"""
		self.msg = msg
		self.data = data

	def get_message(self):
		"""
			Returns the message of the exception.

			:return the message of the exception.
				:rtype str
		"""
		return self.msg

	def to_dict(self):
		"""
			Returns the dict representation of the exception.

			:return the dict representation of the exception
				:rtype dict
		"""
		return {"msg": self.msg, "data": self.data}

	def __str__(self):
		"""
			Returns the message of the exception when calling to the function str(BancardAPIException).

			:return the message of the exception.
				:rtype str
		"""
		return str(self.msg)


# exceptions for the configuration of the BancardAPI
class BancardAPIConfigurationException(BancardAPIException):
	pass


# exceptions for the charge request operation
class BancardAPIInvalidParameterException(BancardAPIException):
	pass


class BancardAPIMarketplaceChargeIDAlreadyExistsException(BancardAPIException):
	pass


class BancardAPIChargeRejectedException(BancardAPIException):
	pass


class BancardAPIChargeInconsistentValuesException(BancardAPIException):
	pass


# exceptions for the payment rejections
class BancardAPIPaymentRejectecException(BancardAPIException):
	pass


class BancardAPIPaymentMethodNotEnabledException(BancardAPIPaymentRejectecException):
	pass


class BancardAPIPaymentTransactionInvalidException(BancardAPIPaymentRejectecException):
	pass


class BancardAPIPaymentMethodNotEnoughFundsException(BancardAPIPaymentRejectecException):
	pass


class BancardAPIPaymentRejectecUnknownReasonException(BancardAPIPaymentRejectecException):
	pass


# exceptions for the roll-back operations
class BancardAPINotRolledBackException(BancardAPIException):
	pass


# exceptions for the bancard webhook
class BancardAPIInvalidWebhookException(BancardAPIException):
	pass


class BancardAPIInvalidWebhookDataException(BancardAPIException):
	pass


class BancardAPIInvalidWebhookTokenException(BancardAPIException):
	pass
