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

/**
 * Created by riot on 08.07.17.
 */

function capitalize(input, all) {
    let reg = (all) ? /([^\W_]+[^\s-]*) */g : /([^\W_]+[^\s-]*)/;
    return (input) ? input.replace(reg, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    }) : '';
}

function toLength(input) {
    return input.slice(0, 50);
}

export {capitalize, toLength};

