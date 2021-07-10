const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
// const date = require(__dirname + "/date.js");

const app = express();

app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

mongoose.connect(
	"mongodb+srv://<username><password>@cluster0.ckjgk.mongodb.net/todolistDB",
	{ useNewUrlParser: true }
);

const itemSchema = {
	name: String,
};

const Item = mongoose.model("Item", itemSchema);

const item1 = new Item({
	name: "Welcome to the todoList.",
});

const item2 = new Item({
	name: "Hit the + button to add.",
});

const item3 = new Item({
	name: "<-- Hit this to delete.",
});

const defaultItems = [item1, item2, item3];

const listSchema = {
	name: String,
	items: [itemSchema],
};

const List = mongoose.model("List", listSchema);

// Item.insertMany(defaultItems, function(err) {
//     if(err) console.log(err);
//     else console.log("suc");
// })

// const items = [];
// const workItems = [];

app.get("/", function (req, res) {
	// let day = date.getDate();
	// res.render("list", {listTitle: day, newListItems: items});

	Item.find({}, function (err, foundItems) {
		if (foundItems.length === 0) {
			Item.insertMany(defaultItems, function (err) {
				if (err) console.log(err);
				else console.log("suc");
			});
			res.redirect("/");
		} else {
			res.render("list", { listTitle: "Today", newListItems: foundItems });
		}
	});
	// res.render("list", {listTitle: "Today", newListItems: items});
});

app.post("/", function (req, res) {
	// let item = req.body.newItem;
	// if(req.body.list === "Work") {
	//     workItems.push(item);
	//     res.redirect("/work");
	// } else {
	//     items.push(item);
	//     res.redirect("/");
	// }

	const itemName = req.body.newItem;
	const listName = req.body.list;

	const item = new Item({
		name: itemName,
	});

	if (listName === "Today") {
		item.save();

		res.redirect("/");
	} else {
		List.findOne({ name: listName }, function (err, foundList) {
			foundList.items.push(item);
			foundList.save();
			res.redirect("/" + listName);
		});
	}
});

app.get("/:customListName", function (req, res) {
	const customListName = _.capitalize(req.params.customListName);

	List.findOne({ name: customListName }, function (err, foundList) {
		if (!err) {
			if (!foundList) {
				const list = new List({
					name: customListName,
					items: defaultItems,
				});
				list.save();
				res.redirect("/" + customListName);
			} else {
				res.render("list", {
					listTitle: foundList.name,
					newListItems: foundList.items,
				});
			}
		}
	});

	const list = new List({
		name: customListName,
		items: defaultItems,
	});

	list.save();
});

app.post("/delete", function (req, res) {
	const checkItemId = req.body.ckbx;
	const listName = req.body.listName;

	if (listName === "Today") {
		Item.findByIdAndRemove(checkItemId, function (err) {
			if (err) console.log(err);
			else {
				console.log("suc1");
				res.redirect("/");
			}
		});
	} else {
		List.findOneAndUpdate(
			{ name: listName },
			{ $pull: { items: { _id: checkItemId } } },
			function (err, foundList) {
				if (!err) res.redirect("/" + listName);
			}
		);
	}
});

// app.get("/work", function(req, res) {
//     res.render("list", {listTitle: "Work List", newListItems: workItems});
// });

// app.post("/work", function(req, res) {
//     let item = req.body.newItem;
//     workItems.push(item);

//     res.redirect("/work");
// });

let port = process.env.PORT;
if (port == null || port == "") port = 3000;

app.listen(port, function () {
	console.log("Server is running");
});
