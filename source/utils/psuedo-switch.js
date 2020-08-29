/*	
//	Copyright 2020 Shawn Gates
//
//	Licensed under the Apache License, Version 2.0 (the "License");
//	you may not use this file except in compliance with the License.
//	You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//	Unless required by applicable law or agreed to in writing, software
// 	distributed under the License is distributed on an "AS IS" BASIS,
//	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// 	See the License for the specific language governing permissions and
// 	limitations under the License.
// 
//	@author Shawn Gates
*/

let callbacks = {};

/**
 * Adds items to the psuedoSwitch functions callback list
 * @param {String}   _case Value to use for the 'switch case'
 * @param {Function} fn    Function to call when _case match is made
 */
function add(_case, fn) {
   callbacks[_case] = callbacks[_case] || [];
   callbacks[_case].push(fn);
}

/**
 * Function that works like a switch case but allows for 'cases' to be added dynamically
 * @param  {String} value String to check against the callback list
 */
function pseudoSwitch(value) {
   if (callbacks[value]) {
      callbacks[value].forEach(function(fn) {
          fn();
      });
   }
}

exports.list = callbacks;
exports.add = add;
exports.pseudoSwitch = pseudoSwitch;