// REQUEST PARAMETER
const prm = 1;

// Get the treeViewElement from the DOM
const treeViewElement = document.getElementById("treeView");

// Function to fetch data from the server
async function getData() {
	try {
		// Fetch data from the server
		const response = await fetch(
			`http://64.251.10.84/ords/aduit_erp/V_BALANCE_SHEET_R/V_BALANCE_SHEET_R?prm=${prm}`
		);
		// Convert the response to JSON
		const responseData = await response.json();
		// Extract the 'items' property from the response
		const data = responseData.items;
		// Build a tree structure from the data
		const nestedTree = buildTree(data);

		// Iterate over the nodes in the tree and create the tree view in the DOM
		nestedTree.forEach((rootNode) => {
			// Check if the node has children
			const hasChildren = rootNode.children.length > 0;
			// Create the tree view for the node
			createTreeView(rootNode, treeViewElement, hasChildren);
		});

		// Return the data
		return data;
	} catch (err) {
		// Log any errors that occur during the process
		console.log(err);
	}
}

// Call the function to fetch and process the data
getData();

// Function to build a tree structure from the input array
function buildTree(arr) {
	const tree = [];
	const map = {};

	arr.forEach((item) => {
		// Create a new item with an empty children array
		const newItem = { ...item, children: [] };
		// Map the item by its level
		map[item.level] = newItem;

		if (item.level === 1) {
			// If it's a root node, add it to the tree
			tree.push(newItem);
		} else {
			// Otherwise, add it as a child of its parent
			const parent = map[item.level - 1];
			parent.children.push(newItem);
		}
	});

	return tree;
}

// Create a template for the tree view
const treeView = document.getElementById("treeView");

// Function to create the tree view in the DOM
function createTreeView(node, parentElement, hasChildren) {
	const div = document.createElement("div");
	div.classList.add("hasChildren");

	const titleDiv = document.createElement("div");
	titleDiv.classList.add("title");
	// Create the arrow icon and node title
	titleDiv.innerHTML = `<span>${hasChildren ? "&#8629;" : ""} &nbsp; ${
		node.title
	}</span>`;

	const yearsInfoTemplate = `
		<div class="yearsInfo">
			<div class="year">
				<span>${Number(node.current_year).toFixed(3)}</span>
			</div>
			<div class="year">
				<span>${Number(node.last_year).toFixed(3)}</span>
			</div>
		</div>
	`;

	titleDiv.innerHTML += yearsInfoTemplate;
	div.appendChild(titleDiv);

	if (node.children.length > 0) {
		const childrenDiv = document.createElement("div");
		childrenDiv.classList.add("children", "childrenHidden");

		node.children.forEach((child) => {
			// Check if the node has children
			const hasChildren = child.children.length > 0;
			// Create the tree view for the child node
			createTreeView(child, childrenDiv, hasChildren);
		});

		div.appendChild(childrenDiv);

		// Toggle visibility of children when the title is clicked
		titleDiv.addEventListener("click", () => {
			childrenDiv.classList.toggle("childrenHidden");
			// Remove the 'isActive' class from all other elements
			document.querySelectorAll(".isActive").forEach((el) => {
				el.classList.remove("isActive");
			});
			// Add the 'isActive' class to the clicked title
			titleDiv.classList.add("isActive");
		});
	}

	// Append the created tree view element to the parent element
	parentElement.appendChild(div);
}