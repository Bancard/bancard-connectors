Bancard VPOS 1.0 - Bancard Python Connector 0.4 library
=======================================================

Getting Started
---------------

This library allows developers to integrates their Python backend
applications to the Bancard VPOS API.

This library works with the following Python versions: 2.6, 2.7, 3.3,
3.4, 3.5, 3.6

Prerequisites
~~~~~~~~~~~~~

See the requirements.txt file to see which Python libraries will be
required.

Usage in Staging or Production
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

You can either include this library from:

::

    https://github.com/vcajes/bancard-connector-python

Or install the library from the `PYPI
repository <https://pypi.python.org/pypi/bancardconnectorpython/>`__:

::

    pip3 install bancardconnectorpython

Usage in development
~~~~~~~~~~~~~~~~~~~~

-  Downlaod and install `Python (2.6 <= version <=
   3.6) <https://www.python.org/downloads/>`__.
-  Run ``pip3 install bancardpythonconnector``.
-  Import and use library in your source code: ``from decimal import Decimal from bancardconnectorpython import connector, BancardAPI, BancardAPIException``.

This will autoconfigure the connector from the following OS environment variables:
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

BANCARD\_ENVIRONMENT=sandbox\|production

BANCARD\_PUBLIC\_KEY=your\_public\_key

BANCARD\_PRIVATE\_KEY=your\_private\_key

bancard\_api = bancardpythonconnector.connector

or you could just create your own BancardAPI
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

bancard\_api = BancardAPI(environment=BancardAPI.ENVIRONMENT\_SANDBOX,
public\_key=your\_public\_key, private\_key=your\_private\_key)


Running tests
-------------

-  Download and install `Python (2.6 <= version <= 3.6) <https://www.python.org/downloads/>`__
-  Install the library from PYPI: ``pip install bancardconnectorpython``
-  View the Python tests under the ``./tests/`` folder for examples of
   how to use it.
-  Modify the global variables ``TEST_BANCARD_PUBLIC_KEY`` and
   ``TEST_BANCARD_PRIVATE_KEY`` from the test files with the values
   provided by Bancard.
-  Run any of the tests, i.e.:
   ``python /path/to/tests/test_bancard_rollback.py``

Versioning
----------

For the versions available, see the `tags on this
repository <https://github.com/vcajes/bancard-connector-python/tags>`__

Authors
-------

-  **Victor Cajes** - [@vcajes](https://github.com/vcajes)

License
-------

This project is licensed under the MIT License - see the
`LICENSE <LICENSE.txt>`__ file for details.