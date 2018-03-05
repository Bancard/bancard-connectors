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


# possibles values for the BancardAPI environment class member
ENVIRONMENT_SANDBOX = "sandbox"
ENVIRONMENT_PRODUCTION = "production"

# Currencies that Bancard allows for charging
BANCARD_ALLOWED_CURRENCIES = ["PYG"]

BANCARD_BASE_URL_SANDBOX = "https://vpos.infonet.com.py:8888"
BANCARD_BASE_URL_PRODUCTION = "https://vpos.infonet.com.py"

# Keys for the SANDBOX_URLS / PRODUCTION_URLS dictionaries
ROLLBACK_KEY = "rollback"
CHARGE_TOKEN_GENERATOR_KEY = "single_buy"
PAYMENT_WEB_URL_KEY = "payment"
CONFIRMATIONS_KEY = "confirmations"

# Bancard WebService development (sandbox) environment endpoints
BANCARD_SANDBOX_URLS = {
	ROLLBACK_KEY: "%s/vpos/api/0.3/single_buy/rollback" % BANCARD_BASE_URL_SANDBOX,
	CHARGE_TOKEN_GENERATOR_KEY: "%s/vpos/api/0.3/single_buy" % BANCARD_BASE_URL_SANDBOX,
	PAYMENT_WEB_URL_KEY: "%s/payment/single_buy?process_id=" % BANCARD_BASE_URL_SANDBOX,
	CONFIRMATIONS_KEY: "%s/vpos/api/0.3/single_buy/confirmations" % BANCARD_BASE_URL_SANDBOX,
}

# Bancard WebService production environment endpoints
BANCARD_PRODUCTION_URLS = {
	ROLLBACK_KEY: "%s/vpos/api/0.3/single_buy/rollback" % BANCARD_BASE_URL_PRODUCTION,
	CHARGE_TOKEN_GENERATOR_KEY: "%s/vpos/api/0.3/single_buy" % BANCARD_BASE_URL_PRODUCTION,
	PAYMENT_WEB_URL_KEY: "%s/payment/single_buy?process_id=" % BANCARD_BASE_URL_PRODUCTION,
	CONFIRMATIONS_KEY: "%s/vpos/api/0.3/single_buy/confirmations" % BANCARD_BASE_URL_PRODUCTION,
}

# All the Bancard WebService endpoints for sandbox/production
BANCARD_URLS = {
	ENVIRONMENT_SANDBOX: BANCARD_SANDBOX_URLS,
	ENVIRONMENT_PRODUCTION: BANCARD_PRODUCTION_URLS
}
