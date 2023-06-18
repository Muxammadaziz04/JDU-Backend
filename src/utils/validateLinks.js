function validateLinks(links) {
    if (Array.isArray(links)) {
      links.forEach(link => {
        if (!/^(ftp|http|https):\/\/[^ "]+$/.test(link)) {
          throw new Error('Invalid link: ' + link);
        }
      });
    } else {
      if (!/^(ftp|http|https):\/\/[^ "]+$/.test(links)) {
        throw new Error('Invalid link: ' + links);
      }
    }
}

module.exports = validateLinks