const { DataTypes, Model, Op, Sequelize } = require("sequelize");
require("dotenv").config();

const { DB, DB_USER, DB_PASS, DB_HOST, DB_DIALECT } = process.env;

const sequelize = new Sequelize(DB, DB_USER, DB_PASS, {
  dialect: DB_DIALECT,
  host: DB_HOST,
});

// createDB = async () => {
//   await sequelize.query(
//     `CREATE DATABASE IF NOT EXISTS ${DB}`,
//     (err, results) => {
//       console.log(results);
//       console.log(err);
//     }
//   );
// };

// // createDB();

// const Foo = sequelize.define("foo", {
//   name: DataTypes.STRING,
// });
// const Bar = sequelize.define(
//   "bar",
//   {
//     name: DataTypes.STRING,
//   },
//   {
//     paranoid: true,
//   }
// );

// Foo.hasMany(Bar, {
//   foreignKey: "myFooId",
// });
// Bar.belongsTo(Foo, {
//   // foreignKey: "myFooId",
// });
// // Foo.hasMany(Bar);
// // Foo.belongsToMany(Bar, { through: "baz" });

// // async function test() {
// //   // after this line we have a record only in foo table with the name 'the-foo'
// //   const foo = await Foo.create({ name: "the-foo" });
// //   // after this line we have a record in bar table with the name 'some-bar' and with no link to the foo record
// //   const bar1 = await Bar.create({ name: "some-bar" });
// //   // after this line we have another record in bar table with the name 'another-bar' and with no link to the foo record
// //   const bar2 = await Bar.create({ name: "another-bar" });
// //   // this output is correct. We don't have any bar records with a link to the foo record yet
// //   console.log(await foo.getBar()); // null
// //   // now we set a link between 'some-bar' record and the foo record (by setting fooId in this bar record)
// //   await foo.setBar(bar1);
// //   // this output is correct. We have 'some-bar' record linked to the foo record
// //   console.log((await foo.getBar()).name); // 'some-bar'
// //   await foo.setBar(null);
// //   // PAY ATTENTION: this line does NOT clear the previous link in 'some-bar' record, after executing it we will have TWO records linked to the foo record: 'some-bar' and 'yet-another-bar'
// //   await foo.createBar({ name: "yet-another-bar" });
// //   // here we will get either 'some-bar' or 'yet-another-bar' record (depends on what record will return PostgreSQL as the first one)
// //   const newlyAssociatedBar = await foo.getBar();
// //   // this output may or may NOT be correct depending on what linked records out of two ones linked to the foo record will be returned first.
// //   console.log(newlyAssociatedBar.name); // 'yet-another-bar' or 'some-bar'
// //   // here we clear ALL (two in our case) links in bar records to the foo record
// //   await foo.setBar(null); // Un-associate
// //   // correct output. We have three records in the bar table and all of them are with null fooId column values.
// //   console.log(await foo.getBar()); // null
// // }

// async function test2() {
//   const foo = await Foo.create({ name: "the-foo" });
//   const bar1 = await Bar.create({ name: "some-bar" });
//   const bar2 = await Bar.create({ name: "another-bar" });
//   console.log(await foo.getBars()); // []
//   console.log(await foo.countBars()); // 0
//   console.log(await foo.hasBar(bar1)); // false
//   await foo.addBars([bar1, bar2]);
//   console.log(await foo.countBars()); // 2
//   await foo.addBar(bar1);
//   console.log(await foo.countBars()); // 2
//   console.log(await foo.hasBar(bar1)); // true
//   await foo.removeBar(bar2);
//   console.log(await foo.countBars()); // 1
//   await foo.createBar({ name: "yet-another-bar" });
//   console.log(await foo.countBars()); // 2
//   // await foo.setBars([]); // Un-associate all previously associated bars
//   await Bar.destroy({
//     where: {
//       id: 1,
//     },
//   });
//   console.log(await foo.countBars()); // 0
// }

const User = sequelize.define(
  "user",
  { name: DataTypes.STRING },
  { timestamps: false }
);
const Task = sequelize.define(
  "task",
  { name: DataTypes.STRING },
  { timestamps: false }
);
const Tool = sequelize.define(
  "tool",
  {
    name: DataTypes.STRING,
    size: DataTypes.STRING,
  },
  { timestamps: false }
);
User.hasMany(Task);
Task.belongsTo(User);
User.hasMany(Tool, { as: "Instruments" });

const test3 = async () => {
  const user1 = await User.create({ name: "John doe" });
  const task1 = await Task.create({ name: "A task1", userId: 1 });
  const user2 = await User.create({ name: "John doe2" });
  const task2 = await Task.create({ name: "A task2", userId: 2 });

  const tasks = await Task.findAll({ include: User });
  console.log(JSON.stringify(tasks, null, 2));
  
  const users = await User.findAll({ include: Task });
  console.log(JSON.stringify(users, null, 2));
};

const connect = async function () {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ force: true });

    test3();
    console.log(`database connected`);
  } catch (error) {
    console.error(error);
  }
};

connect();
