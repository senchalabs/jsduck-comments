test:
	node sql/load_test_db.js
	jasmine-node spec/
