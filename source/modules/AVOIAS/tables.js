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
"use strict";

let Races =  {
    1:  {
            name: 'Deva',
            subraces: {
                '1-8': 'Lantern Deva',
                '9-14': 'Sword Deva',
                '15-20': 'Trumpet Deva'
            },
            cultures: {
                '1-7': 'Eurydicean',
                '8-13': 'Persean',
                '14-20': 'Rhodean'
            }
        },
    2:  {
            name: 'Dragonborn',
            subraces: {
                '1-4': 'Black Dragonborn',
                '5-8': 'Blue Dragonborn',
                '9-12': 'Green Dragonborn',
                '13-16': 'Red Dragonborn',
                '17-20': 'White Dragonborn'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Persean',
                '8-14': 'Rhodean',
                '15-20': 'Styxish'
            }
        },
    3:  {
            name: 'Dwarf',
            subraces: {
                '1-8': 'Bronze Dwarf',
                '9-14': 'Gold Dwarf',
                '15-20': 'Iron Dwarf'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '17-20': 'Styxish'
            }
        },
    4:  {
            name: 'Dwarf',
            subraces: {
                '1-8': 'Bronze Dwarf',
                '9-14': 'Gold Dwarf',
                '15-20': 'Iron Dwarf'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '17-20': 'Styxish'
            }
        },
    5:  {
            name: 'Elf',
            subraces: {
                '1-8': 'Moon Elf',
                '9-16': 'Sun Elf',
                '17-20': 'Twilight Elf'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '17-20': 'Styxish'
            }
        },
    6:  {
            name: 'Elf',
            subraces: {
                '1-8': 'Moon Elf',
                '9-16': 'Sun Elf',
                '17-20': 'Twilight Elf'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '17-20': 'Styxish'
            }
        },
    7:  {
            name: 'Forged',
            subraces: {
                '1-10': 'Skill Forged',
                '11-20': 'War Forged'
            },
            cultures: {
                '1-8': 'Lycori',
                '9-20': 'Styxish'
            }
        },
    8:  {
            name: 'Genasi',
            subraces: {
                '1-5': 'Air Genasi',
                '6-10': 'Earth Genasi',
                '11-15': 'Fire Genasi',
                '16-20': 'Water Genasi'
            },
            cultures: {
                '1-7': 'Eurydicean',
                '8-13': 'Lycori',
                '14-20': 'Persean'
            }
        },
    9:  {
            name: 'Goliath',
            subraces: {
                '1-5': 'Fire Goliath',
                '6-10': 'Frost Goliath',
                '11-15': 'Stone Goliath',
                '16-20': 'Storm Goliath'
            },
            cultures: {
                '1-6': 'Aethran',
                '7-10': 'Lycori',
                '11-14': 'Rhodean',
                '15-20': 'Styxish'
            }
        },
    10: {
            name: 'Halfling',
            subraces: {
                '1-4': 'Furchin Halfling',
                '5-12': 'Hairfoot Halfling',
                '13-20': 'Strongheart Halfling'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '14-20': 'Styxish'
            }
        },
    11: {
            name: 'Halfling',
            subraces: {
                '1-4': 'Furchin Halfling',
                '5-12': 'Hairfoot Halfling',
                '13-20': 'Strongheart Halfling'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '14-20': 'Styxish'
            }
        },
    12: {
            name: 'Half-Human',
            subraces: {
                '1-5': 'Half-Dwarven Human',
                '6-15': 'Half-Elven Human',
                '16-20': 'Half-Orcish Human'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '14-20': 'Styxish'
            }
        },
    13: {
            name: 'Human',
            subraces: {
                '1-20': 'Humans have no subraces'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '14-20': 'Styxish'
            }
        },
    14: {
            name: 'Human',
            subraces: {
                '1-20': 'Humans have no subraces'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '14-20': 'Styxish'
            }
        },
    15: {
            name: 'Human',
            subraces: {
                '1-20': 'Humans have no subraces'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '14-20': 'Styxish'
            }
        },
    16: {
            name: 'Human',
            subraces: {
                '1-20': 'Humans have no subraces'
            },
            cultures: {
                '1-4': 'Aethran',
                '5-7': 'Eurydicean',
                '8-10': 'Lycori',
                '11-13': 'Persean',
                '14-16': 'Rhodean',
                '14-20': 'Styxish'
            }
        },
    17: {
            name: 'Kith',
            subraces: {
                '1-5': 'Furred Kith',
                '6-10': 'Horned Kith',
                '11-15': 'Scaled Kith',
                '16-20': 'Winged Kith'
            },
            cultures: {
                '1-8': 'Aethran',
                '9-12': 'Eurydicean',
                '13-16': 'Persean',
                '17-20': 'Rhodean'
            }
        },
    18: {
            name: 'Shade',
            subraces: {
                '1-10': 'Corruption Shade',
                '11-20': 'Death Shade'
            },
            cultures: {
                '1-6': 'Aethran',
                '7-10': 'Eurydicean',
                '11-14': 'Lycori',
                '15-20': 'Styxish'
            }
        },
    19: {
            name: 'Tabaxi',
            subraces: {
                '1-10': 'Maned Tabaxi',
                '11-20': 'Rosette Tabaxi'
            },
            cultures: {
                '1-10': 'Eurydicean',
                '11-20': 'Lycori'
            }
        },
    20: {
            name: 'Tiefling',
            subraces: {
                '1-3': 'Accuser Tiefling',
                '4-6': 'Deceiver Tiefling',
                '11-15': 'Destroyer Tiefling',
                '16-20': 'Tempter Tiefling'
            },
            cultures: {
                '1-4': 'Apollian',
                '5-10': 'Faenar',
                '11-16': 'Gorgan',
                '17-20': 'Shaitani'
            }
        },
}

let FamilyLife =  {
    1:  'Abandoned',
    2:  'Adopted',
    3:  'Adopted',
    4:  'Bastard',
    5:  'Blended',
    6:  'Blended',
    7:  'Disowned',
    8:  'Extended',
    9:  'Extended',
    10: 'Extended',
    11: 'Foundling',
    12: 'Foundling',
    13: 'Grandparent',
    14: 'Isolated',
    15: 'Nuclear',
    16: 'Nuclear',
    17: 'Nuclear',
    18: 'Orphaned',
    19: 'Orphaned',
    20: 'Ward',
}

let Status = {
    1:  'Outcast',
    2:  'Slave',
    3:  'Slave',
    4:  'Serf',
    5:  'Serf',
    6:  'Serf',
    7:  'Serf',
    8:  'Serf',
    9:  'Serf',
    10: 'Peasant',
    11: 'Peasant',
    12: 'Peasant',
    13: 'Peasant',
    14: 'Peasant',
    15: 'Peasant',
    16: 'Peasant',
    17: 'Freeman',
    18: 'Freeman',
    19: 'Freeman',
    20: 'Noble',
}

let Religion = {
    1:  'Docead',
    2:  'Docead',
    3:  'Docead',
    4:  'Docead',
    5:  'Abadar',
    6:  'Aradia',
    7:  'Desna',
    8:  'Ishtar',
    9:  'Kord',
    10: 'Melora',
    11: 'Mystra',
    12: 'Oghma',
    13: 'Pelor',
    14: 'Pharasma',
    15: 'Torag',
    16: 'Torm',
    17: 'None',
    18: 'None',
    19: 'None',
    20: 'None',
}

let Occupation = {
    1:  'Beggar',
    2:  'Charlatan',
    3:  'Entertainer',
    4:  'Hermit',
    5:  'Hunter',
    6:  'Thief',
    7:  'Healer',
    8:  'Sailor',
    9:  'Guard',
    10: 'Farmer',
    11: 'Laborer',
    12: 'Servant',
    13: 'Soldier',
    14: 'Artists',
    15: 'Clergy',
    16: 'Craftsman',
    17: 'Merchants',
    18: 'Administrators',
    19: 'Mages',
    20: 'Scholars',
}


let Event = {
    1:  'None',
    2:  'Betrayed',
    3:  'Bullied',
    4:  'Crime',
    5:  'Died',
    6:  'Disaster',
    7:  'Encounter',
    8:  'Fall',
    9:  'Imprisoned',
    10: 'Inheritance',
    11: 'Kidnapped',
    12: 'Kill',
    13: 'Loss',
    14: 'Love',
    15: 'Mentored',
    16: 'Power',
    17: 'Raided',
    18: 'Study',
    19: 'Victory',
    20: 'War',
}


let Associate = {
    1:  'The Academic',
    2:  'The Artisan',
    3:  'The Boss',
    4:  'The Champion',
    5:  'The Confidante',
    6:  'The Criminal',
    7:  'The Fiend',
    8:  'The Fool',
    9:  'The Hunter',
    10: 'The Influencer',
    11: 'The Lover',
    12: 'The Mentor',
    13: 'The Mercenary',
    14: 'The Mystic',
    15: 'The Noble',
    16: 'The Pariah',
    17: 'The Relative',
    18: 'The Seer',
    19: 'The Undead',
    20: 'The Wanderer',
}


let Class = {
    1: {
            name: 'Artificer',
            backgrounds: {
                '1-2': 'Craft',
                '3-4': 'Discovery',
                '5-6': 'Experimentation',
                '7-8': 'Fire',
                '9-10': 'Formulaes',
                '11-12': 'Healing',
                '13-14': 'Industry',
                '15-16': 'Magic',
                '17-18': 'Mechanics',
                '19-20': 'Survival',
            }
        },
    2: {
            name: 'Bard',
            backgrounds: {
                '1-2': 'Celebrity',
                '3-4': 'Culture',
                '5-6': 'Espionage',
                '7-8': 'Knowledge',
                '9-10': 'Love',
                '11-12': 'Mentor',
                '13-14': 'Talent',
                '15-16': 'Training',
                '17-18': 'Treasure',
                '19-20': 'Truth'
            }
        },
    3: {
            name: 'Barbarian',
            backgrounds: {
                '1-2': 'Bloodlust',
                '3-4': 'Conquest',
                '5-6': 'Devotion',
                '7-8': 'Hatred',
                '9-10': 'Immortality',
                '11-12': 'Nihilism',
                '13-14': 'Primitivism',
                '15-16': 'Shame',
                '17-18': 'Suffering',
                '19-20': 'Vengeance'
            }
        },
    4: {
            name: 'Cleric',
            backgrounds: {
                '1-2': 'Atonement',
                '3-4': 'Conversion',
                '5-6': 'Dedication',
                '7-8': 'Destiny',
                '9-10': 'Enlightenment',
                '11-12': 'Miracles',
                '13-14': 'Refuge',
                '15-16': 'Resurrection',
                '17-18': 'Upbringing',
                '19-20': 'Visions'
            }
        },
    5: {
            name: 'Druid',
            backgrounds: {
                '1-2': 'Avatar',
                '3-4': 'Beasts',
                '5-6': 'Circle',
                '7-8': 'Exile',
                '9-10': 'Fey',
                '11-12': 'Legacy',
                '13-14': 'Plants',
                '15-16': 'Savagery',
                '17-18': 'Spirit',
                '19-20': 'Survival'
            }
        },
    6: {
            name: 'Fighter',
            backgrounds: {
                '1-2': 'Adventurer',
                '3-4': 'Conscript',
                '5-6': 'Gladiator',
                '7-8': 'Hero',
                '9-10': 'Knight',
                '11-12': 'Mercenary',
                '13-14': 'Outlander',
                '15-16': 'Scholar',
                '17-18': 'Streetfighter',
                '19-20': 'Watchman'
            }
        },
    7: {
            name: 'Monk',
            backgrounds: {
                '1-2': 'Academic',
                '3-4': 'Elite',
                '5-6': 'Exotic',
                '7-8': 'Hands-On',
                '9-10': 'Nature',
                '11-12': 'Secret',
                '13-14': 'Spiritual',
                '15-16': 'Technical',
                '17-18': 'Tournament',
                '19-20': 'Unconventional'
            }
        },
    8: {
            name: 'Paladin',
            backgrounds: {
                '1-2': 'Debt',
                '3-4': 'Destiny',
                '5-6': 'Epiphany',
                '7-8': 'Independence',
                '9-10': 'Institution',
                '11-12': 'Justice',
                '13-14': 'Mentorship',
                '15-16': 'Penance',
                '17-18': 'Philosophy',
                '19-20': 'Secrecy'
            }
        },
    9: {
            name: 'Ranger',
            backgrounds: {
                '1-2': 'Bounties',
                '3-4': 'Exile',
                '5-6': 'Hatred',
                '7-8': 'Logic',
                '9-10': 'Survival',
                '11-12': 'Trophies',
                '13-14': 'Vengeance',
                '15-16': 'Virtue',
                '17-18': 'Weakness',
                '19-20': 'Zealotry'
            }
        },
    10: {
            name: 'Rogue',
            backgrounds: {
                '1-2': 'Assassin',
                '3-4': 'Gangster',
                '5-6': 'Henchman',
                '7-8': 'Outlaw',
                '9-10': 'Scout',
                '11-12': 'Sidekick',
                '13-14': 'Spy',
                '15-16': 'Thief',
                '17-18': 'Thrillseeker',
                '19-20': 'Urchin'
            }
        },
    11: {
            name: 'Sorcerer',
            backgrounds: {
                '1-2': 'Bond',
                '3-4': 'Chaos',
                '5-6': 'Denial',
                '7-8': 'Dream',
                '9-10': 'Heritage',
                '11-12': 'Invincibility',
                '13-14': 'Luck',
                '15-16': 'Mystery',
                '17-18': 'Terror',
                '19-20': 'Trained'
            }
        },
    12: {
            name: 'Warlock',
            backgrounds: {
                '1-2': 'Abandonment',
                '3-4': 'Aimlessness',
                '5-6': 'Desire',
                '7-8': 'Desperation',
                '9-10': 'Fear',
                '11-12': 'Frustration',
                '13-14': 'Loneliness',
                '15-16': 'Meekness',
                '17-18': 'Possession',
                '19-20': 'Unknown'
            }
        },
    13: {
            name: 'Wizard',
            backgrounds: {
                '1-2': 'Acceptance',
                '3-4': 'Artifacts',
                '5-6': 'Challenges',
                '7-8': 'Control',
                '9-10': 'Immortality',
                '11-12': 'Knowledge',
                '13-14': 'Legacy',
                '15-16': 'Power',
                '17-18': 'Purpose',
                '19-20': 'Respect'
            }
        },
}

exports.Races = Races;
exports.FamilyLife = FamilyLife;
exports.Status = Status;
exports.Religion = Religion;
exports.Occupation = Occupation;
exports.Event = Event;
exports.Associate = Associate;
exports.Class = Class;
