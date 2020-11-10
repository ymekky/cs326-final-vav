window.addEventListener("load", async function() {
	document.getElementById('sel1').onchange = () => {
		if(document.getElementById('sel1').value === 'looking for a rider') {
			document.getElementById('sel2-label').innerHTML = '';
			document.getElementById('sel2-label').innerHTML = 'Where will you leave from?';
		}
		else {
			document.getElementById('sel2-label').innerHTML = '';
			document.getElementById('sel2-label').innerHTML = 'Where do you want to leave from?';	
		}
	}; 

	document.getElementById('search-click').addEventListener('click', () => {
		window.location.replace('bestMatches.html');
	});
});
