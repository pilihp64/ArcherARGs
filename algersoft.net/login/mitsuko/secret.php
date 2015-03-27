
<link rel="stylesheet" type="text/css" href="../../stylesheet.css">
<br>
<br>
<br>


<h1>RESTRICTED AREA!</h1>

<div class="wrap">
<div class="block"><a href="mitsuko/fisherman's daughter.php" class="php">	<div class="img php">&nbsp;</div>	<div class="name">
		<div class="file">fisherman's daughter</div>
		<div class="date">105 B</div>
	</div>
	</a>
</div><div class="block"><a href="mitsuko/forty four b.png" class="png">	<div class="img png">&nbsp;</div>	<div class="name">
		<div class="file">forty four b.png</div>
		<div class="date">78.07 KB</div>
	</div>
	</a>
</div>
<script>
	$(document).ready(function() 
	{
		$("a.dir").click(function(e)
		{
		 	$('.sub[data-folder="' + $(this).attr('href') + '"]').slideToggle();
			console.log( $(this).attr('href') );
			e.preventDefault();
		});
	
	});
</script>
</div>        <form><input type="submit" name="logout" action="?logout" method="get" value="LOG OUT"</input></form>
<br><br><br><br>
</body>
</html>