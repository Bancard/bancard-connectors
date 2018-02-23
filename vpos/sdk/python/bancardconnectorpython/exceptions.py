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
	def __init__(self, msg="", data=None, status=400, code=""):
		self.msg = msg
		self.data = data
		self.code = code
		self.status = status

	def get_message(self):
		return self.msg

	def to_dict(self):
		return {
			"msg": self.msg,
			"data": self.data,
			"code": self.code,
			"status": self.status,
		}

	def __str__(self):
		return str(self.msg)


class BancardAPIConfigurationException(BancardAPIException):
	pass


class BancardAPIInvalidParameterException(BancardAPIException):
	pass


# exceptions for the charge request operation
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
