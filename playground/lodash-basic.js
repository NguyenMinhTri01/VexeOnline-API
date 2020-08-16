const _ = require('lodash');
const { values } = require('lodash');

const user_1 = {
  name: 'nguyen minh trí',
  age: 22,
  education: {
    university : "UIT"
  },
  jobs : [
    {
      title : "teacher",
      type : "full time"
    },
    {
      title : "dev",
      type : "part time"
    }
  ]
}


const user_2 = {
  name: 'nguyen minh trí2',
  age: 25,
  education: {
    university : "UIT"
  },
  jobs : []
}


// const users = [user_1, user_2];

// users.forEach((user) => {
//   //user.job && user.job.length > 0  ? console.log(user.jobs[0].title) : console.log(null);
//   console.log(_.get(user, "jobs[0].title","thất nghiệp"));
// })
//.chain


// const partUrl =  url.split('/')
// const courseIndex = partUrl.indexOf('courses');
// const courseIndexId = partUrl[courseIndex + 1];
const url = 'https://cybersoft.edu.vn/courses/1/chapters/2/videos/5';

const getObjectId = (type) => { 
  return _.chain(url)
  .split('/')
  .indexOf(`${type}`)//index courses
  .thru(value => value + 1) // index courseid
  .thru(value => {//course can tìm
    return _.chain(url)
            .split('/')
            .get(value)
            .value()
  })
  .value()
}




console.log(getObjectId("courses"));