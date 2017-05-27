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

import { assert } from 'chai';

import TodoService from './todo.service.js';

let service;

describe('TodoService', function () {

    beforeEach(function () {
        let initialTodos = [];
        service = new TodoService(initialTodos);
    });

    it('should contain empty todos after initialization', function () {
        assert.equal(service.todos.length, 0);
    });

    it('should add todo', function () {
        service.addTodo('Finish example project');
        assert.equal(service.todos.length, 1);
        assert.equal(service.todos[0].label, 'Finish example project');
        assert.equal(service.todos[0].done, false);
    });

    it('should toggle todo', function () {
        service.addTodo('Finish example project');
        assert.equal(service.todos[0].done, false);

        service.toggleTodo('Finish example project');
        assert.equal(service.todos[0].done, true);

        service.toggleTodo('Finish example project');
        assert.equal(service.todos[0].done, false);
    });

    it('should remove done todos', function () {
        service.addTodo('Todo1');
        service.addTodo('Todo2');
        service.addTodo('Todo3');
        assert.equal(service.todos.length, 3);

        service.toggleTodo('Todo1');
        service.removeDoneTodos();
        assert.equal(service.todos.length, 2);
    });

});
