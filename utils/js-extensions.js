/*  
//  Copyright 2020 Shawn Gates
//
//  Licensed under the Apache License, Version 2.0 (the "License");
//  you may not use this file except in compliance with the License.
//  You may obtain a copy of the License at
//
//  http://www.apache.org/licenses/LICENSE-2.0
//
//  Unless required by applicable law or agreed to in writing, software
//  distributed under the License is distributed on an "AS IS" BASIS,
//  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//  See the License for the specific language governing permissions and
//  limitations under the License.
// 
//  @author Shawn Gates
*/

if (String.prototype.splice === undefined) {
  /**
   * Splices text within a string.
   * @param {int} offset The position to insert the text at (before)
   * @param {string} text The text to insert
   * @param {int} [removeCount=0] An optional number of characters to overwrite
   * @returns {string} A modified string containing the spliced text.
   */
  String.prototype.splice = function(offset, text, removeCount=0) {
    let calculatedOffset = offset < 0 ? this.length + offset : offset;
    return this.substring(0, calculatedOffset) +
      text + this.substring(calculatedOffset + removeCount);
  };
}

if (Map.prototype.merge === undefined) {
  /**
  * Merges provided map into this map and returns the new combined map
  * @param {Map} map The second map to merge into this map
  * @returns {Map} A new Map that is a combination of the two maps
  **/
  Map.prototype.merge = function(map) {
  	let mapTest = map instanceof Map
  	if(!mapTest) {
  		console.log('Merge requires a Map object be supplied.');
  		return;
  	}

  	let newMap = new Map([...map, ...this]);

  	return newMap;
  };
}

