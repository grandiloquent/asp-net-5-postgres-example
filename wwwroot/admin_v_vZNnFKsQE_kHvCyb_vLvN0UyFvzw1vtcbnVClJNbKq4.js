document.getElementById("url").addEventListener("keyup",n=>{n.keyCode===13&&fetch(`/api/video/url?url=${encodeURIComponent(document.getElementById("url").value)}`).then(n=>n.json()).then(n=>{document.getElementById("id").value=n.id,document.getElementById("title").value=n.title,document.getElementById("url").value=n.url,document.getElementById("thumbnail").value=n.thumbnail,document.getElementById("publish_date").value=n.publishDate,document.getElementById("duration").value=n.duration,document.getElementById("create_at").value=n.createAt,document.getElementById("update_at").value=n.updateAt,document.getElementById("views").value=n.views,document.getElementById("type").value=n.type,document.getElementById("hidden").value=n.hidden})});document.getElementById("submit").addEventListener("click",()=>{var n={};n.id=parseInt(document.getElementById("id").value);n.title=document.getElementById("title").value;n.url=document.getElementById("url").value;n.thumbnail=document.getElementById("thumbnail").value;n.publishDate=document.getElementById("publish_date").value;n.duration=parseInt(document.getElementById("duration").value);n.createAt=parseInt(document.getElementById("create_at").value);n.updateAt=parseInt(document.getElementById("update_at").value);n.views=parseInt(document.getElementById("views").value);n.type=parseInt(document.getElementById("type").value);n.hidden=document.getElementById("hidden").checked;fetch(`/api/video/update`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(n)}).then(n=>n.text()).then(n=>{console.log(n)})})