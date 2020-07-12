// Helper function to create a unique random code.
const generateRandomCode = codes => {
  const codeLength = 8;
  const asciiRanges = [
    { start: 97, end: 122 }, 
    { start: 65, end: 90 }, 
    { start: 48, end: 57 }
  ];

  do {
    var code = "";

    for (let i = 0; i < codeLength; i++) {
      const asciiRange = Math.floor(Math.random() * 3);
      const currentIndex = Math.floor(Math.random() * (asciiRanges[asciiRange].end - asciiRanges[asciiRange].start + 1) + asciiRanges[asciiRange].start);
      code += String.fromCharCode(currentIndex);
    }
  } while (codes.includes(code));

  console.log(code);

  return code;
}

async function createLot(root, { name, description }, { currentUser, models }) {

  const lots = await models.lot.findAll({
    attributes: ['code']
  });

  if (!lots) {
    throw new Error("Could not get lots to add new lot to.");
  }

  const codes = lots.map(lot => {
    return lot.code;
  });

  const user = await models.user.findOne({
    where: {
      id: currentUser.userId
    }
  });

  if (!user) {
    throw new Error("Could not find current user.");
  }

  const [lot, createdLot] = await models.lot.findOrCreate({
    where: {
      name: name
    },
    defaults: {
      name,
      description,
      code: generateRandomCode(codes),
      authorId: user.id
    }
  });

  if (!createdLot) {
    throw new Error(`${name} lot already exists.`);
  }

  if (!lot) {
    throw new Error(`Could not create ${name} lot for user ${user.email}.`);
  }

  return lot;

}

async function joinLot(root, { id, code }, { currentUser, models }) {

}

async function editLot(root, { id, name, description }, { currentUser, models }) {

}

async function deleteLot(root, { id }, { currentUser, models }) {

}

module.exports = {
  createLot, 
  joinLot, 
  editLot, 
  deleteLot
};
