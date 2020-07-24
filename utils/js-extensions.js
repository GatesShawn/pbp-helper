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


/**
*
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