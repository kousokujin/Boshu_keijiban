require('dotenv').config();

config_dict = {
  development: {
    username: "docker",
    password: "docker",
    database: "app",
    host: "mysql_db",
    dialect: "mysql",
    app_port: "8080",
  },
  test: {
    username: "root",
    password: null,
    database: "database_test",
    host: "127.0.0.1",
    dialect: "mysql",
    app_port: "8080",
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIARECT,
    app_port: process.env.PORT,
  }
}

var config = config_dict['development'];
if(process.env.NODE_ENV != null){
  const node_env = process.env.NODE_ENV;

  if(node_env == 'development' || node_env == 'test' || node_env == "production"){
    config = config_dict[node_env];
  }
}

module.exports = config;