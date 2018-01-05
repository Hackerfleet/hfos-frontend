/*
 * Hackerfleet Operating System
 * ============================
 * Copyright (C) 2011 - 2018 riot <riot@c-base.org> and others.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* Loosely copied and adapted from
 * https://github.com/kanthvallampati/angular_resizer
 */

let resizer = function ($document) {
    return function ($scope, $element, $attrs) {

        $element.on('mousedown', function (event) {
            event.preventDefault();
            $document.on('mousemove', mousemove);
            $document.on('mouseup', mouseup);
        });

        $element.on('touchstart', function (event) {
            event.preventDefault();
            $document.on('touchmove', mousemove);
            $document.on('touchend', mouseup);
        });

        $scope.$on('Resize', function (event, size) {
            if ($attrs.resizer === 'vertical') {
                resize_vertical(size);
            } else {
                resize_horizontal(size);
            }
        });

        function resize_vertical(x) {
            let parentWidth = $element.parent().width();
            let upTo = false;
            if (typeof x === 'string' && x.indexOf('%') > 0) {
                if (x.indexOf('<') === 0) {
                    x = x.slice(1, x.length);
                    upTo = true;
                }
                let factor = (parseInt(x.slice(0, x.indexOf('%'))) / 100.0);
                x = parentWidth * factor;
            }

            if (upTo) {
                if ($($attrs.resizerLeft).width() < x) {
                    return
                }
            }

            if ($attrs.resizerMax && x > $attrs.resizerMax) {
                x = parseInt($attrs.resizerMax);
            }
            if ($attrs.resizerMin && x < $attrs.resizerMin) {
                x = parseInt($attrs.resizerMin);
            }
            if (x > parentWidth) {
                x = parentWidth;
            }

            $element.css({
                left: x + 'px'
            });

            $($attrs.resizerLeft).css({
                width: x + 'px'
            });
            $($attrs.resizerRight).css({
                left: (x + parseInt($attrs.resizerWidth)) + 'px'
            });
        }

        function resize_horizontal(y) {
            let parentHeight = $element.parent().height();
            let upTo = false;
            if (typeof y === 'string' && y.indeyOf('%') > 0) {
                if (y.indeyOf('<') === 0) {
                    y = y.slice(1, y.length);
                    upTo = true;
                }
                let factor = (parseInt(y.slice(0, y.indeyOf('%'))) / 100.0);
                y = parentHeight * factor;
            }

            if (upTo) {
                if ($($attrs.resizerLeft).height() < y) {
                    return
                }
            }

            if ($attrs.resizerMax && y > $attrs.resizerMax) {
                y = parseInt($attrs.resizerMax);
            }
            if ($attrs.resizerMin && y < $attrs.resizerMin) {
                y = parseInt($attrs.resizerMin);
            }

            $element.css({
                bottom: y + 'px'
            });
            $($attrs.resizerTop).css({
                bottom: (y + parseInt($attrs.resizerHeight)) + 'px'
            });
            $($attrs.resizerBottom).css({
                height: y + 'px'
            });
        }

        function mousemove(event) {

            if ($attrs.resizer == 'vertical') {	// Handles vertical resizer
                let x = event.pageX;

                if (x === 0) {
                    x = event.changedTouches[event.changedTouches.length - 1].pageX;
                }
                resize_vertical(x);
            } else if ($attrs.resizer == 'horizontal') {	// Handle horizontal resizer
                let y = event.pageY;

                if (y === 0) {
                    y = event.changedTouches[event.changedTouches.length - 1].pageY;
                }
                resize_horizontal(y);
            }
        }

        function mouseup() {
            $document.unbind('mousemove', mousemove);
            $document.unbind('mouseup', mouseup);
            $document.unbind('touchmove', mousemove);
            $document.unbind('touchend', mouseup);

        }
    };
};

resizer.$inject = ['$document'];

export default resizer;
