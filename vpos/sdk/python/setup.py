from distutils.core import setup


def readme():
	with open('README.rst') as f:
		return f.read()


setup(
	name='bancardconnectorpython',
	version='0.5.2',
	author='Victor Cajes',
	author_email='vcajes@gmail.com',
	packages=['bancardconnectorpython'],
	scripts=[],
	url='https://github.com/vcajes/bancard-connector-python',
	license="Documentation: https://github.com/vcajes/bancard-connector-python/tree/python-connector/vpos/sdk/python",
	description='The Bancard Python connector provides Python APIs to create, process and manage payments.',
	long_description=readme(),
	package_data={'bancardconnectorpython': []},
	install_requires=['requests[security]>=2.18.4'],
	classifiers=[
		'Intended Audience :: Developers',
		'Natural Language :: English',
		'Operating System :: OS Independent',
		'Programming Language :: Python',
		'Programming Language :: Python :: 2',
		'Programming Language :: Python :: 2.6',
		'Programming Language :: Python :: 2.7',
		'Programming Language :: Python :: 3',
		'Programming Language :: Python :: 3.3',
		'Programming Language :: Python :: 3.4',
		'Programming Language :: Python :: 3.5',
		'Programming Language :: Python :: 3.6',
		'Programming Language :: Python :: Implementation :: PyPy',
		'Topic :: Software Development :: Libraries :: Python Modules'
	],
	keywords=['bancard', 'paraguay', 'python', 'rest', 'sdk', 'charges', 'webhook']
)
