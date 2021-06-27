const mysqlconnection = require("../model/databaseconncetivity");

const express = require("express");
const mysql = require("mysql");
const bodyparser = require("body-parser");
const { query } = require("express");
const path = require("path");
const app = express();

mysqlconnection.connect(function (err) {
  if (!err) {
    console.log("no error while connecting db");
  } else {
    console.log(err);
  }
});
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static("../public"));
// function to send home page
app.get("/", function (req, res) {
  dummystr = path.resolve(__dirname, "..", "public", "index.html");
  res.sendFile(dummystr);
});
// function to send rec login page
app.get("/reclogin", function (req, res) {
  res.sendFile(path.resolve(__dirname, "..", "public", "login2.html"));
});
// function to login
app.get("/viewPatient.html", function (req, res) {
  res.sendFile(path.resolve(__dirname, "..", "public", "viewPatient.html"));
});
// function to send options page
app.get("/options", function (req, res) {
  res.sendFile(path.resolve(__dirname, "..", "public", "options.html"));
});
app.get("/detailentry.html", function (req, res) {
  res.sendFile(path.resolve(__dirname, "..", "public", "detailentry.html"));
});
var dummyid = -1;
app.post("/update", function (req, res) {
  dummyid = parseInt(req.body.pid);
  console.log(dummyid);
  res.sendFile(path.resolve(__dirname, "..", "public", "update.html"));
});
app.post("/updatedata", function (req, res) {
  pid = req.body.pid;
  pname = req.body.pname;
  p_age = req.body.p_age;
  pphone = req.body.pphone;
  blood_group = req.body.blood_group;
  pweight = req.body.pweight;
  pgender = req.body.pgender;

  paddress = req.body.paddress;
  paddate = req.body.paddate;
  updatequerry = `update patient set pname='${pname}',p_age=${p_age},pphone=${pphone},pgender='${pgender}',blood_group='${blood_group}',pweight=${pweight},paddress='${paddress}',paddate='${paddate}' 
       where pid=${pid}`;
  mysqlconnection.query(updatequerry, function (err, row, field) {
    if (err) {
      console.log("error has occured near line 71 index.js");
    }
  });
  res.send("updated");
});
app.get("/getpidsdetail", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  mysqlconnection.query(
    `select * from patient where pid=${dummyid}`,
    function (err, row, field) {
      console.log(dummyid);
      if (err) {
        console.log("something went wrong");
      } else {
        console.log(row);
        res.send(row);
      }
    }
  );
});
// function to store doctor details into db
app.post("/doctorentry", function (req, res) {
  dname = req.body.drname;
  dqualification = req.body.drqu;
  squery = `insert into doctor (dname,dqualification) value ('${dname}','${dqualification}');`;
  let validate = async () => {
    mysqlconnection.query(squery, function (err, row, fields) {
      if (err) {
        return new Error("got an error");
      } else {
        return row;
      }
    });
  };
  validate().then((data) => {
    if (data != Error) {
      res.send("doctor has been inserted");
    } else {
      res.status(500);
      res.send("some error");
    }
  });
});
// function to getdoctor details
app.get("/getdoctor", function (req, res) {
  squery = `select * from doctor`;
  res.setHeader("Access-Control-Allow-Origin", "*");
  mysqlconnection.query(squery, function (err, row, field) {
    if (err) {
      console.log("error at line 122", err);
    } else {
      // console.log(row)
      res.send(row);
    }
  });
});
// function to save patient details into db.
app.post("/savedata", function (req, res) {
  // pid = req.body.pid;
  pname = req.body.pname;
  p_age = req.body.page;
  pphone = req.body.pnumber;
  blood_group = req.body.pbloodgroup;
  pweight = req.body.pweight;
  pgender = req.body.gender;

  paddress = req.body.paddress;
  paddate = req.body.padmissiondate;
  did = req.body.sel1;

  console.log(did);
  console.log(pgender);
  console.log(paddress);

  insertquerry = `insert into  patient(pname,p_age,pphone,pgender,blood_group,pweight,paddress,paddate) values ('${pname}',${p_age},${pphone},'${pgender}','${blood_group}',${pweight},'${paddress}','${paddate}')`;
  let pid = async () => {
    mysqlconnection.query(insertquerry, function (err, row, fiels) {
      if (!err) {
        console.log("im here");
        console.log(row);
        treetsId = async () => {
          mysqlconnection.query(
            `insert into treats values(${row["insertId"]},${did})`,
            (err, row, fields) => {
              if (!err) {
                return "success";
              } else {
                return "failure while inerting doctor and patient";
              }
            }
          );
        };
        treetsId().then((data) => {
          return data;
        });
      } else {
        return "failure";
      }
    });
  };
  // insertquerry2=`insert into room(pno) values()`
  pid().then((data) => {
    console.log(data);
    res.send("patient has been inserted");
  });
});
// all related to profile
var id = -1;
app.get("/patientprofile/:pid", function (req, res) {
  id = req.params.pid;
  res.sendFile(path.resolve(__dirname, "..", "public", "patient-profile.html"));
});
// function to delete a patient
app.get("/deleteprofile/:pid", function (req, res) {
  id = req.params.pid;
  console.log(id);
  // mysqlconnection.query()
  mysqlconnection.query(
    `delete from patient where pid=${id};`,
    function (err, row, field) {
      if (err) {
        console.log("error at line 196 while doing delete");
      } else {
        console.log(row);
        res.sendFile(
          path.resolve(__dirname, "..", "public", "viewPatient.html")
        );
        // res.send("deleted")
      }
    }
  );
});
app.get("/profiledata", function (req, res) {
  console.log(id);
  res.setHeader("Access-Control-Allow-Origin", "*");
  squery = `select p.pno, pname ,admission_date,dr_name,r.room_no from patient p, doctor d,room r
 where d.dr_id=p.dr_id and p.pno=${id} and r.pno=${id}; `;
  mysqlconnection.query(squery, function (err, row, field) {
    if (err) {
      console.log("error at line 175", err);
    } else {
      console.log(row);
      res.send(row);
    }
  });
});
app.get("/getroom", function (req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  console.log(id);
  mysqlconnection.query(
    `select room_no from room where pno=${id}`,
    function (row, err, fields) {
      if (!err) {
        console.log(row);
        res.send(row);
      } else {
        console.log(err);
      }
    }
  );
});
// functio
app.get("/getdata", function (req, res) {
  mysqlconnection.query("select * from patient;", function (err, row, fields) {
    if (!err) {
      // console.log(row.length)
      console.log(row);
      // console.log((row[11]["admission_date"]))
      // d = row[11]["admission_date"]
      // str = d.toISOString().split('T')[0]
      // console.log(str)
      res.setHeader("Access-Control-Allow-Origin", "*");
      res.send(row);
    }
  });
});
app.listen(80, function () {
  console.log("server started");
});
