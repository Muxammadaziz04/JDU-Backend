function validateLinks(links) {
    if (!Array.isArray(links)) {
      throw new Error('Links must be an array');
    }
  
    links.forEach(link => {
      if (!/^(ftp|http|https):\/\/[^ "]+$/.test(link)) {
        throw new Error('Invalid link: ' + link);
      }
    });
}

module.exports = {
    validateLinks
}