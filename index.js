var express = require("express");
var app     = express();
var path    = require("path");
var mysql = require('mysql2');
var bodyParser = require('body-parser');
var ejs = require ('ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
var con = mysql.createConnection({
     host : "localhost",
     user : "root",
     password : "root",
     database : "db_intern"
});
var listOfTasks =[];
var taskToSearch;


// app.get('/',function(req,res){
//   res.sendFile(path.join(__dirname+'/index.html'));
// });
// app.post('/',function(req,res){


app.use(express.static(path.join(__dirname, 'public')));

// Set 'views' directory for any views 
// being rendered res.render()
app.set('views', path.join(__dirname, 'views'));

// Set view engine as EJS
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', path.join(__dirname, 'views'));
 
app.set('view engine', 'ejs'); 
app.set('views', __dirname + '/views'); 
app.use(express.static('public'));


app.post('/insert',function(req,res){

    
  var taskList=req.body.taskList;
  var listofLists = req.body.listofLists;
  var due_date = req.body.dueDate;
  var arr = [taskList,listofLists]
  listOfTasks.push(arr);
  
var moment = require('moment');
var dateTime = moment(Date.now()).format('YYYY-MM-DD');
  res.write('You made task list "' + req.body.taskList+'".\n');
const date1 = new Date(due_date);
const date2 = new Date(dateTime);
var late = "Late";
var notLate = "";
  con.connect(function(err) 
  {
  if(date1 < date2)
  {
    var sql = "insert into List(tasks, listname, date,late,status) values (?,?,?,?,?)";
  con.query(sql, [taskList, listofLists, due_date, late,"not done"], function (err, result) {
  if (err) throw err;
  console.log(result.affectedRows + " record(s) updated");
  });
  
  }
  else
  {
    var sql = "insert into List(tasks, listname, date,late,status) values (?,?,?,?,?)";
  con.query(sql, [taskList, listofLists, due_date, notLate, "not done"], function (err, result) {
  if (err) throw err;
  console.log(result.affectedRows + " record(s) updated");
  });
  
  }
});
con.connect(function(err)
{
  var sql = "select * from list";
  con.query(sql, function (err, result) {
  if (err) throw err;
  else
  {
    var sql = "SELECT listname, SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS tasks_done, SUM(CASE WHEN status = 'not done' THEN 1 ELSE 0 END) AS tasks_not_done,COUNT(*) AS total_tasks FROM list GROUP BY listname ORDER BY tasks_not_done DESC";
  con.query(sql, function (err, result2) {
  if (err) throw err;
  else
  {
    res.render('index', { variable: result, variable2:result2});
  }
})
  }})
});

});

app.post('/remove',function(req,res){

    
  var taskRemove =req.body.taskID;  

  con.connect(function(err) 
  {
  
    var sql = "delete from List where task_id="+taskRemove;
    con.query(sql, function (err, result) {
    if (err) throw err;
    console.log(result.affectedRows + " record(s) updated");
    });
});
con.connect(function(err)
{
  var sql = "select * from list";
  con.query(sql, function (err, result) {
  if (err) throw err;
  else
  {
    var sql = "SELECT listname, SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS tasks_done, SUM(CASE WHEN status = 'not done' THEN 1 ELSE 0 END) AS tasks_not_done,COUNT(*) AS total_tasks FROM list GROUP BY listname ORDER BY tasks_not_done DESC";
  con.query(sql, function (err, result2) {
  if (err) throw err;
  else
  {
    res.render('index', { variable: result, variable2:result2});
  }
})
  }
  

})
})

});
app.post('/search',function(req,res){

    
  taskToSearch=req.body.taskToSearch;
  con.connect(function(err)
  {
    var x = 0;
    taskToSearch=req.body.taskToSearch;
    taskToSearch = "%"+taskToSearch+"%";
    var sql = `select * from list where tasks like ("`+taskToSearch+`")`;
    con.query(sql, function (err, result) {
      if (err) throw err;
      else
        {
          x = result.length;
          console.log(x);
        }
      });
      
    var sql = `(select * from list where tasks like ("`+taskToSearch+`")) UNION (select * from list where listname like ("`+taskToSearch+`")) UNION (select * from list where tasks not like ("`+taskToSearch+`"))`;
    con.query(sql, function (err, result) {
    if (err) throw err;
    else
    {
      var sql = "SELECT listname, SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS tasks_done, SUM(CASE WHEN status = 'not done' THEN 1 ELSE 0 END) AS tasks_not_done,COUNT(*) AS total_tasks FROM list GROUP BY listname ORDER BY tasks_not_done DESC";
    con.query(sql, function (err, result2) {
    if (err) throw err;
    else
    {
      res.render('index', { variable: result, variable2:result2});
    }
})
    }
    });
  })
  });



  app.post('/sort',function(req,res){

  
    con.connect(function(err)
    {
        var sql= `select * from list order by date`;
        con.query(sql, function (err, result) {
      if (err) throw err;
      else
      {
        var sql = "SELECT listname, SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS tasks_done, SUM(CASE WHEN status = 'not done' THEN 1 ELSE 0 END) AS tasks_not_done,COUNT(*) AS total_tasks FROM list GROUP BY listname ORDER BY tasks_not_done DESC";
      con.query(sql, function (err, result2) {
      if (err) throw err;
      else
      {
        res.render('index', { variable: result, variable2:result2});
      }
  })
      }
      });
    })
  

  var moment = require('moment');
  var dateTime = moment(Date.now()).format('YYYY-MM-DD');
    });

    app.post('/status',function(req,res){

      var taskID =req.body.taskstatusID;  
    
      con.connect(function(err) 
      {
      
        var sql = "UPDATE list SET status = CASE WHEN status = 'done' THEN 'not done' ELSE 'done' END WHERE task_id ="+taskID;
        con.query(sql, function (err, result) {
        if (err) throw err;
        console.log(result.affectedRows + " record(s) updated");
        });
    });
    con.connect(function(err)
    {
      var sql = "select * from list";
      con.query(sql, function (err, result) {
      if (err) throw err;
      else
      {
        var sql = "SELECT listname, SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS tasks_done, SUM(CASE WHEN status = 'not done' THEN 1 ELSE 0 END) AS tasks_not_done,COUNT(*) AS total_tasks FROM list GROUP BY listname ORDER BY tasks_not_done DESC";
      con.query(sql, function (err, result2) {
      if (err) throw err;
      else
      {
        res.render('index', { variable: result, variable2:result2});
      }
  })
      }
      
    
    })
    })
    
    });
  
 
app.get('/', (req, res) => { 
  const variableToSend = 'Hello from Node.js!'; 

  con.connect(function(err) 
    {
    
      var sql = "select * from list";
      con.query(sql, function (err, result) {
      if (err) throw err;
      else
      {
        var sql = "SELECT listname, SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS tasks_done, SUM(CASE WHEN status = 'not done' THEN 1 ELSE 0 END) AS tasks_not_done,COUNT(*) AS total_tasks FROM list GROUP BY listname ORDER BY tasks_not_done DESC";
      con.query(sql, function (err, result2) {
      if (err) throw err;
      else
      {
        res.render('index', { variable: result, variable2:result2});
      }
  })
      }
      })
})
}); 


  
app.post('/filter',function(req,res){

  
  con.connect(function(err)
  {
      var sql= `SELECT listname, tasks, task_id,late FROM list ORDER BY listname ASC, tasks ASC`;
      con.query(sql, function (err, result) {
    if (err) throw err;
    else
    {
      var sql = "SELECT listname, SUM(CASE WHEN status = 'done' THEN 1 ELSE 0 END) AS tasks_done, SUM(CASE WHEN status = 'not done' THEN 1 ELSE 0 END) AS tasks_not_done,COUNT(*) AS total_tasks FROM list GROUP BY listname ORDER BY tasks_not_done DESC";
    con.query(sql, function (err, result2) {
    if (err) throw err;
    else
    {
      res.render('index', { variable: result, variable2:result2});
    }
})
    }
    });
  })
  });

  





const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
