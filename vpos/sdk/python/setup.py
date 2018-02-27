from distutils.core import setup


setup(
	name='bancardconnectorpython',
	version='0.3',
	author='Victor Cajes',
	author_email='vcajes@gmail.com',
	packages=['bancardconnectorpython'],
	scripts=[],
	url='https://github.com/vcajes/bancard-connector-python',
	license='MIT License',
	description='The Bancard Python connector provides Python APIs to create, process and manage payments.',
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
		'Topic :: Software Development :: Libraries :: Bancard'
	],
	keywords=['bancard', 'paraguay', 'python', 'rest', 'sdk', 'charges', 'webhook']
)
