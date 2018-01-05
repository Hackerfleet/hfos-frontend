.. image:: https://travis-ci.org/Hackerfleet/hfos-frontend.svg?branch=master
    :target: https://travis-ci.org/Hackerfleet/hfos-frontend
.. image:: https://codeclimate.com/github/Hackerfleet/hfos-frontend/badges/gpa.svg
   :target: https://codeclimate.com/github/Hackerfleet/hfos-frontend
   :alt: Code Climate
.. image:: https://codeclimate.com/github/Hackerfleet/hfos-frontend/badges/coverage.svg
   :target: https://codeclimate.com/github/Hackerfleet/hfos-frontend/coverage
   :alt: Test Coverage
.. image:: https://codeclimate.com/github/Hackerfleet/hfos-frontend/badges/issue_count.svg
   :target: https://codeclimate.com/github/Hackerfleet/hfos-frontend
   :alt: Issue Count
.. image:: https://badges.greenkeeper.io/Hackerfleet/hfos-frontend.svg
   :alt: Greenkeeper badge
   :target: https://greenkeeper.io/

HFOS - The Hackerfleet Operating System
=======================================

    A modern, opensource approach to maritime navigation.

    This software package is supposed to run on your ship/car/plane/ufo's
    board computer.

*Obligatory Warning*: **Do not use for navigational purposes!**

*Always have up to date paper maps and know how to use them!*

Frontend
========

This is the frontend submodule. Please check <https://github.com/hackerfleet/hfos>
for more information about HFOS.


License
=======

Copyright (C) 2011-2017 Heiko 'riot' Weinen <riot@c-base.org> and others.

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <http://www.gnu.org/licenses/>.

Bugs & Discussion
=================

Please research any bugs you find via our `Github issue tracker for
HFOS <https://github.com/hackerfleet/hfos/issues>`__ and report them,
if they're still unknown.

If you want to discuss (opensource) maritime technology in general
incl. where we're heading, head over to our `Github discussion
forum <https://github.com/hackerfleet/discussion/issues>`__
...which is cleverly disguised as a Github issue tracker.

Installation
------------

To install the frontend, update and pull this submodule, then instruct the
manage tool to build and install the frontend:

.. code-block:: bash

    $ cd frontend
    $ git pull
    $ cd ..
    $ python hfos_manage -install-frontend

Be aware, that all HFOS modules you intend to use and develop on should
be installed before building the frontend.
You can reinstall the frontend after changing what modules you're using.

Assets
------

This is migrating over to hfos-frontend submodule.

-  Fabulous icons by iconmonstr.com and Hackerfleet contributors


-- :boat: :+1:
