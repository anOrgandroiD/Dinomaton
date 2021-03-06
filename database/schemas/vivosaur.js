const mongoose = require('mongoose');

module.exports = mongoose.model("Vivosaur", new mongoose.Schema({
    num: { type: Number },
    element: { type: String },
    name: { type: String },
    class: { type: String },
    description: { type: String },
    sprite: { type: String },
    stats: { type: {
        LP: { type: Number },
        ATT: { type: Number },
        DEF: { type: Number },
        ACC: { type: Number },
        SPE: { type: Number }
    }},
    skills: { type: [{
        name: { type: String },
        type: { type: String, default: null },
        baseDamage: { type: Number, default: 0 },
        fpCost: { type: Number },
        effect: { type: {
            description: { type: String },
            rate: { type: Number, default: 100 }
        }}
    }]},
    support: { type: {
        supportPosition: { type: String },
        ATT: { type: Number },
        DEF: { type: Number },
        ACC: { type: Number },
        SPE: { type: Number }
    }, default: [] },
    misc: { type: {
        genus: { type: String, default: null },
        properName: { type: String, default: null },
        modelName: { type: String, default: null },
        group: { type: String, default: null },
        family: { type: String, default: null },
        order: { type: String, default: null },
        era: { type: String, default: null },
        length: { type: {
            feet: { type: Number },
            meters: { type: Number },
            overall: { type: String }
        }},
        diet: { type: String, default: null },
        discovered: { type: [String], default: null },
        favoriteFood: { type: String, default: null },
        likes: { type: String, default: null },
        favoritePlace: { type: String, default: null },
        power: { type: String, default: null },
        warrantyPeriod: { type: String, default: null },
        humanAge: { type: String, default: null }
    }}
}));
