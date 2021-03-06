const Discord = require('discord.js');
const config = require('../config.json');
usersDB = require('./schemas/user.js');
fightersDB = require('./schemas/fighter.js');
matchesDB = require('./schemas/match.js');
draftsDB = require('./schemas/draft.js');
vivosaursDB = require('./schemas/vivosaur.js');
superEvolversDB = require('./schemas/super_evolvers.js');

/*------------- USER COMMANDS -------------*/

//Creates the database to store users
module.exports.getUserDB = async function(userID) {
    let userDB = await usersDB.findOne(
        { id: userID }
    );
    if(userDB) {
        return userDB;
    } else {
        return false;
    }
};

module.exports.getUserDB = async function(userID, userTag) {
    let userDB = await usersDB.findOne(
        { id: userID }
    );
    if(userDB) {
        return userDB;
    } else {
        userDB = new usersDB({
            id: userID,
            tag: userTag
        })
        await userDB.save().catch(err => console.log(err));
        return userDB;
    }
};

module.exports.userDBExists = async function(userID) {
    let userDB = await usersDB.findOne(
        { id: userID }
    );
    if(userDB)
        return true;
    else
        return false;
};

/*------------ FIGHTER COMMANDS ------------*/

//Creates the database to store fighters
module.exports.setFighterDB = async function(fighterID, fighterTag) {
    fighterDB = new fightersDB({
        id: fighterID,
        fighterName: fighterTag
    });
    await fighterDB.save().catch(err => console.log(err));
    return fighterDB;
};

module.exports.getFighterDB = async function(fighterID) {
    let fighterDB = await fightersDB.findOne(
        { id: fighterID }
    );
    return fighterDB;
};

module.exports.getLicenseStatus = async function(fighterID) {
    let fighterDB = await fightersDB.findOne(
        { id: fighterID }
    );
    return fighterDB.licenseStatus;
};

module.exports.fighterDBExists = async function(fighterID) {
    let fighterDB = await fightersDB.findOne(
        { id: fighterID },
        { licenseStatus: 'certified'}
    );
    if(fighterDB)
        return true;
    else
        return false;
};

module.exports.increaseWins = async function(fighterID) {
    let fighterDB = await fightersDB.findOneAndUpdate(
        { id: fighterID },
        {$inc:
            {battleWins: 1}
        }
    );
    await fighterDB.save().catch(err => console.log(err));
    return fighterDB;
};

module.exports.increaseLosses = async function(fighterID) {
    let fighterDB = await fightersDB.findOneAndUpdate(
        { id: fighterID },
        {$inc:
            {battleLosses: 1}
        }
    );
    await fighterDB.save().catch(err => console.log(err));
    return fighterDB;
};

module.exports.setFighterName = async function(fighterID, newFighterName) {
    let fighterDB = await fightersDB.findOneAndUpdate(
        { id: fighterID },
        {$set:
            {fighterName: newFighterName}
        }
    );
    await fighterDB.save().catch(err => console.log(err));
    return fighterDB;
}

module.exports.recertifyLicense = async function(fighterID) {
    let fighterDB = await fightersDB.findOneAndUpdate(
        { id: fighterID },
        {$set:
            {licenseStatus: 'certified'}
        }
    );
    await fighterDB.save().catch(err => console.log(err));
    return fighterDB;
}

module.exports.voidLicense = async function(fighterID) {
    let fighterDB = await fightersDB.findOneAndUpdate(
        { id: fighterID },
        {$set:
            {licenseStatus: 'voided'}
        }
    );
    await fighterDB.save().catch(err => console.log(err));
    return fighterDB;
}

/*------------ MATCH COMMANDS ------------*/

module.exports.setMatchDB = async function(challengerID, challengerName, challengeeID, challengeeName) {
    let matchDB = new matchesDB({
        idChallenger: challengerID,
        idChallengee: challengeeID,
        challenger: challengerName,
        challengee: challengeeName
    });
    await matchDB.save().catch(err => console.log(err));
    return matchDB;
}

module.exports.getMatchDB = async function(challengerID, challengeeID, matchStatus) {
    let matchDB = await matchesDB.findOne(
        { $and: [
            { idChallenger: challengerID },
            { idChallengee: challengeeID },
            { status: matchStatus }
        ]}
    );
    return matchDB;
};

module.exports.matchChallengerExists = async function(fighterID) {
    let matchChallenger = await matchesDB.findOne(
        { idChallenger: fighterID }
    );
    if(matchChallenger)
        return true;
    else
        return false;
};

module.exports.matchExists = async function(challengerID, challengeeID, statusArgs) {
    let match = await matchesDB.findOne(
        { $and: [
            { idChallenger: challengerID },
            { idChallengee: challengeeID },
            { $or: [
                { status: statusArgs[0] },
                { status: statusArgs[1] },
                { status: statusArgs[2] }
            ]}
        ]}
    );

    if(match)
        return match;
    else
        return false;
}

module.exports.matchWithUserExists = async function(userID, statusArgs) {
    let match = await matchesDB.findOne(
        { $and: [
            { $or: [
                { idChallenger: userID },
                { idChallengee: userID }
            ]},
            { $or: [
                { status: statusArgs[0] },
                { status: statusArgs[1] },
                { status: statusArgs[2] }
            ]}
        ]}
    );

    if(match)
        return match;
    else
        return false;
}

module.exports.amount = async function(statusArgs) {
    let count = await matchesDB.countDocuments(
        { $or: [
            { status: statusArgs[0] },
            { status: statusArgs[1] },
            { status: statusArgs[2] }
        ]}
    );
    return count;
}

module.exports.deleteMatches = async function(statusArgs) {
    let matchDB = await matchesDB.deleteMany(
        { $or: [
            { status: statusArgs[0] },
            { status: statusArgs[1] },
            { status: statusArgs[2] }
        ]}
    );
    return matchDB;
}


module.exports.setWinner = async function(match, fighterName) {
    let matchDB = await match.updateOne({ winner: fighterName });
    return matchDB;
}

module.exports.setLoser = async function(match, fighterName) {
    let matchDB = await match.updateOne({ loser: fighterName });
    return matchDB;
}

module.exports.acceptMatch = async function(match) {
    let matchDB = await match.updateOne({ status: 'accepted' });
    return matchDB;
}

module.exports.startMatch = async function(match) {
    let matchDB = await match.updateOne({ status: 'in progress' });
    return matchDB;
}

module.exports.completeMatch = async function(match) {
    let matchDB = await match.updateOne({ status: 'completed' });
    return matchDB;
}

module.exports.flagMatch = async function(match) {
    let matchDB = await match.updateOne({ status: 'flagged' });
    return matchDB;
}

module.exports.dropMatch = async function(match) {
    let matchDB = await match.updateOne({ status: 'dropped' });
    return matchDB;
}

/*------------ DRAFT COMMANDS ------------*/

//Creates a new draft document
module.exports.newDraft = async function() {
    draftDB = new draftsDB();
    await draftDB.save().catch(err => console.log(err));
    return draftDB;
};

module.exports.findOngoing = async function() {
    let draft = await draftsDB.findOne(
        { $or: [
            { status: { $ne: 'completed' }},
            { status: { $ne: 'dropped' }}
        ]}
    );

    if(draft)
        return draft;
    else
        return false;
}

module.exports.draftStatus = async function(statusArgs) {
    let draft = await draftsDB.findOne(
        { $or: [
                { status: statusArgs[0] },
                { status: statusArgs[1] },
                { status: statusArgs[2] }
        ]}
    );

    if(draft)
        return draft;
    else
        return false;
}

module.exports.setDraftStatus = async function(draft, newStatus) {
    let updatedDraft = await draftsDB.findOneAndUpdate(
        { _id: draft._id },
        { $set: { status: newStatus }}
    );
    return updatedDraft
}

module.exports.updateFighters = async function(draft, fightersArray) {
    let updatedDraft = await draftsDB.findOneAndUpdate(
        { _id: draft._id },
        { $set: { fighterList: fightersArray }}
    );
    return updatedDraft;
}

module.exports.updateMinFighters = async function(draft, fighters) {
    let updatedDraft = await draftsDB.findOneAndUpdate(
        { _id: draft._id },
        { $set: { minFighters : fighters }}
    );
    return updatedDraft;
}

module.exports.updateMaxFighters = async function(draft, fighters) {
    let updatedDraft = await draftsDB.findOneAndUpdate(
        { _id: draft._id },
        { $set: { maxFighters : fighters }}
    );
    return updatedDraft;
}

module.exports.updatePickTime = async function(draft, time) {
    let updatedDraft = await draftsDB.findOneAndUpdate(
        { _id: draft._id },
        { $set: { pickTime : time }}
    );
    return updatedDraft;
}

module.exports.incrementPick = async function(draft) {
    let updatedDraft = await draftsDB.findOneAndUpdate(
        { _id: draft._id },
        { $inc: { nextPickNum: 1 }}
    );
    return updatedDraft;
}

module.exports.decrementPick = async function(draft) {
    let updatedDraft = await draftsDB.findOneAndUpdate(
        { _id: draft._id },
        { $inc: { nextPickNum: -1 }}
    );
    return updatedDraft;
}

module.exports.findParticipant = async function(userID, statusArgs) {
    let fighter = await draftsDB.findOne(
        { $and: [
            { $or: [
                { status: statusArgs[0] },
                { status: statusArgs[1] },
                { status: statusArgs[2] }
            ]},
            { fighterList: { $elemMatch: { id: userID }}}
        ]}
    );

    if(fighter)
        return fighter;
    else
        return false;
}

module.exports.addParticipant = async function(userID, draft) {
    let fighterDoc = await fightersDB.findOne(
        { id: userID }
    );
    let updatedDraft = await draftsDB.findOneAndUpdate(
        { _id: draft._id},
        { $push: { fighterList: { id: fighterDoc.id, fighterName: fighterDoc.fighterName }}}
    );
    return updatedDraft;
}

module.exports.removeParticipant = async function(userID, draft) {
    let fighterDoc = await fightersDB.findOne(
        { id: userID }
    );
    let updatedDraft = await draftsDB.findOneAndUpdate(
        { _id: draft._id},
        { $pull: { fighterList: { id: fighterDoc.id, fighterName: fighterDoc.fighterName }}}
    );
    return updatedDraft;
}

module.exports.checkDraftSaur = async function(vivosaur) {
    let taken = await fightersDB.findOne(
        { 'currentDraft.takenSaurs': { $in: [vivosaur]}}
    );

    if(taken)
        return taken;
    else
        return false;
}

module.exports.giveDraftSaur = async function(userID, vivosaur) {
    let fighter = await fightersDB.findOneAndUpdate(
            { id: userID },
            { $push: { 'currentDraft.takenSaurs': vivosaur }}
    );
    return fighter;
}

module.exports.replaceSkippedSaur = async function(userID, vivosaur) {
    let fighter = await fightersDB.findOneAndUpdate(
        { $and: [
            { id: userID },
            { 'currentDraft.takenSaurs': "-----" }
        ]},        
        { $set: { 'currentDraft.takenSaurs.$': vivosaur }}
    );
    return fighter;
}

module.exports.gotSuperEvolver = async function(userID) {
    let fighter = await fightersDB.findOneAndUpdate(
        { id: userID },
        { $set: { 'currentDraft.holdsSuperEvolver': true }}
    );
    return fighter;
}

/*------------ VIVOSAUR COMMANDS ------------*/

module.exports.importVivosaurs = async function(dataArray) {
    await vivosaursDB.collection.insertMany(dataArray);
}

module.exports.returnAllVivosaurs = async function() {
    return await vivosaursDB.find();
}

module.exports.returnAllVivosaursWithQuery = async function(arg) {
    return await vivosaursDB.find(
        { $or: [
            { element: arg },
            { 'misc.diet': arg},
            { 'misc.group': arg },
            { 'misc.family': arg },
            { 'misc.length.overall': arg }
        ]}
    );
}

module.exports.vivosaurDocExists = async function(vivosaur) {
    let exists = await vivosaursDB.collection.findOne({ name: vivosaur.name });
    if(exists) {
        return exists;
    } else {
        return false;
    }
}

module.exports.vivosaurNumSuper = async function(number) {
    let exists = await vivosaursDB.collection.findOne(
        { $and: [
            { num: number },
            { 'misc.properName': { $exists: true }}
        ]}
    );

    if(exists) {
        return exists;
    } else {
        return false;
    }
}

module.exports.vivosaurExists = async function(vivosaur) {
    let exists = await vivosaursDB.collection.findOne({ name: vivosaur });
    if(exists) {
        return exists;
    } else {
        return false;
    }
}

/*------------ SUPER EVOLVER COMMANDS ------------*/

module.exports.importSuperEvolvers = async function(dataArray) {
    await superEvolversDB.collection.insertMany(dataArray);
}

module.exports.returnAllSuperEvolvers = async function() {
    return await superEvolversDB.find();
}

module.exports.superEvolverDocExists = async function(vivosaur) {
    let exists = await superEvolversDB.collection.findOne({ name: vivosaur.name });
    if(exists) {
        return exists;
    } else {
        return false;
    }
}

module.exports.superEvolverExists = async function(vivosaur) {
    let exists = await superEvolversDB.collection.findOne({ name: vivosaur });
    if(exists) {
        return exists;
    } else {
        return false;
    }
}