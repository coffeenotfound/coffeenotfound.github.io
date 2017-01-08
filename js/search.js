const QURL = Qurl.create();

// create lunr search index
var searchIndex = lunr(function () {
	this.ref('id');
	this.field('title', { boost: 10 });
	this.field('content', { boost: 5 });
	this.field('author', { boost: 1 });
	this.field('tags', { boost: 10 });
});

$(function() {
	var $searchbox = $("#searchbox");
	var $searchresults = $("#searchresults");
	
	// update searchbox to initial query param
	$searchbox.val(QURL.query('search'));
	
	// fetch the search data from server
	var searchData;
	/*var searchDataRequest = */
	$.getJSON("/search_data.json", function(data) {
		searchData = data;
		
		// add data to lunr
		$.each(data, function(index, value) {
			searchIndex.add(
				$.extend({ "id": index }, value)
			);
		});
		
		// log
		console.log("successfully fetched searchdata");
		
		// search initial search query
		var initalQuery = QURL.query('search');
		console.log("Initial query: \"" + initalQuery + "\"");
		
		doSearch(initalQuery);
	}).fail(function() {
		console.log("Failed to fetch searchdata");
	});
	
	// submit search
	$searchbox.closest("form").submit(function(event) { // on search submit
		// prevent page reloading
		event.preventDefault();
		
		// get query and update url
		var query = $searchbox.val();
		QURL.query('search', query);
		
		// do the search
		doSearch(query);
		
		// scroll results into view
		try {
			$searchresults[0].scrollIntoView();
		}
		catch(e) {}
	});
	
	// realtime search results
	$searchbox.on("input", function(event) { // on search text change
		// update url query
		QURL.query('search', $searchbox.val());
		
		// search
		doSearch($(this).val());
	});
	
	/** actually do the lunr search and display the results */
	function doSearch(query) {
		// ensure searchdata is loaded
		// <NOT YET IMPLEMENTED>
		
		var startTime = new Date().getTime();
		
		// actually let lunr do the search
		var results = searchIndex.search(query);
		
		// remove previous results
		$searchresults.empty();
		
		if(results.length) {
			// create result elements
			results.forEach(function(result) {
				var item = searchData[result.ref];
				
				// build search result and add to container
				var itemElement = buildResultItem(item);
				$searchresults.append(itemElement);
			});
		}
		else {
			// build no results item
			$searchresults.append(buildNoResultsItem());
		}
		
		var endTime = new Date().getTime();
		
		// log
		console.log("searched \"" + query + "\": " + results.length + " results in " + (endTime - startTime) + "ms");
	}
	
	function buildResultItem(item) {
		var element = $.parseHTML("<li class=\"searchresults__item\"><a href=\"" + item.url + "\">" + item.title + "</a></li>");
		//var element = $("<li>");
		//element.html("<li class=\"searchresults__item\"><a href=\"" + item.url + "\">" + item.title + "</a></li>");
		return element;
	}
	
	function buildNoResultsItem() {
		var element = $.parseHTML("<li class=\"searchresults__item  searchresults__item--noresults\"><span>Uhm, nothing here...</span></li>");
		return element;
		//return $('<li><span>Uhm, nothing here...</span></li>');
	}
});