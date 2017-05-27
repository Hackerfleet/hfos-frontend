/*
 * Hackerfleet Operating System
 * ============================
 * Copyright (C) 2011 - 2017 riot <riot@c-base.org> and others.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

'use strict';

describe('TodoService', function () {

    let service;

    beforeEach(angular.mock.module('main'));

    beforeEach(angular.mock.module(function ($provide) {
        $provide.constant('initialTodos', []);
    }));

    beforeEach(angular.mock.inject(function (_TodoService_) {
        service = _TodoService_;
    }));

    it('should contain empty todos after initialization', function () {
        expect(service.todos.length).toBe(0);
    });

    it('should add todo', function () {
        service.addTodo('Finish example project');
        expect(service.todos.length).toBe(1);
        expect(service.todos[0].label).toBe('Finish example project');
        expect(service.todos[0].done).toBe(false);
    });

    it('should toggle todo', function () {
        service.addTodo('Finish example project');
        expect(service.todos[0].done).toBe(false);

        service.toggleTodo('Finish example project');
        expect(service.todos[0].done).toBe(true);

        service.toggleTodo('Finish example project');
        expect(service.todos[0].done).toBe(false);
    });

    it('should remove done todos', function () {
        service.addTodo('Todo1');
        service.addTodo('Todo2');
        service.addTodo('Todo3');
        expect(service.todos.length).toBe(3);

        service.toggleTodo('Todo1');
        service.removeDoneTodos();
        expect(service.todos.length).toBe(2);
    });

});
