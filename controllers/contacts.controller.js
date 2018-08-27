/**
 * Adds the user to the ACM Contacts
 *
 * @param {object} data.user - user object
 * @param {string} data.user.email - user's email
 * @param {string} data.topic - user's interest
 * @param {string} data.otherTopic - user's other interests
 */
function updateSDCGroup(data) {
  return new Promise((resolve, reject) => {
    resolve();
  });
}

/**
 * Adds the user to a SDC Group
 *
 * @param {object} groupInfo - Google Contacts Group information
 * @param {string} email - user email * @param {string} topic - topic of interest
 * @param {string} otherTopic? - Other Topic of interest
 *
 * @return {Promise <Object, Error>} - The new group with the contact added
 */
function addUserToInterestGroup(groupInfo, email, topic, otherTopic) {
  if (!otherTopic) otherTopic = ''

  return new Promise(async (resolve, reject) => {
    try {
      resolve()
    } catch (err) {
      reject(err)
    }
  });
}

module.exports = {
  addUserToInterestGroup,
  updateSDCGroup,
}
