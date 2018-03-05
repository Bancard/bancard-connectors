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


import sys
import random
import unittest
from decimal import Decimal
import bancardconnectorpython


class TestBancardSingleBuy(unittest.TestCase):

	def test_generate_token_ok(self):
		marketplace_charge_id = random.randrange(500000, sys.maxsize >> 8)
		amount, currency = Decimal(1000), "PYG"
		description = "Sample charge"
		approved_url = "http://localhost/redirect/bancard/%s/approved" % marketplace_charge_id
		cancelled_url = "http://localhost/redirect/bancard/%s/cancelled" % marketplace_charge_id

		# configure the bancard API connector from the environment variables and get a reference to the connector
		bancard_api = bancardconnectorpython.connector()

		bancard_process_id, payment_url, bancard_response = bancard_api.generate_charge_token(marketplace_charge_id, amount, description, approved_url, cancelled_url, currency)
		self.assertIsNotNone(bancard_process_id)
		self.assertGreater(len(bancard_process_id), 0)

	def test_duplicate_token_error(self):
		marketplace_charge_id = random.randrange(500000, sys.maxsize >> 8)
		amount, currency = Decimal(1000), "PYG"
		description = "Sample charge"
		approved_url = "http://localhost/redirect/bancard/%s/approved" % marketplace_charge_id
		cancelled_url = "http://localhost/redirect/bancard/%s/cancelled" % marketplace_charge_id

		# configure the bancard API connector from the environment variables and get a reference to the connector
		bancard_api = bancardconnectorpython.connector()

		bancard_process_id, payment_url, bancard_response = bancard_api.generate_charge_token(marketplace_charge_id, amount, description, approved_url, cancelled_url, currency)
		self.assertIsNotNone(bancard_process_id)
		self.assertGreater(len(bancard_process_id), 0)  # the process id should contain at least one character

		# call again to the generate token with the same charge ID in order to get the proper exception
		self.assertRaises(
			bancardconnectorpython.BancardAPIMarketplaceChargeIDAlreadyExistsException,
			bancard_api.generate_charge_token, marketplace_charge_id, amount, description, approved_url, cancelled_url, currency)

	def test_invalid_amount_error(self):
		marketplace_charge_id = random.randrange(500000, sys.maxsize >> 8)
		amount, currency = Decimal(-1), "PYG"  # invalid amount
		description = "Sample charge"
		approved_url = "http://localhost/redirect/bancard/%s/approved" % marketplace_charge_id
		cancelled_url = "http://localhost/redirect/bancard/%s/cancelled" % marketplace_charge_id

		# configure the bancard API connector from the environment variables and get a reference to the connector
		bancard_api = bancardconnectorpython.connector()

		# try to generate the token with an invalid amount
		self.assertRaises(
			bancardconnectorpython.BancardAPIInvalidParameterException,
			bancard_api.generate_charge_token, marketplace_charge_id, amount, description, approved_url, cancelled_url, currency)


if __name__ == '__main__':
	unittest.main()
