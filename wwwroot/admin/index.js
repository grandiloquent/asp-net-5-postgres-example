document.getElementById('url').addEventListener('keyup', ev => {
        if (ev.keyCode === 13) {
            fetch(`/api/video/url?url=${encodeURIComponent(document.getElementById("url").value)}`).then(n => n.json()).then(res => {
                document.getElementById('id').value = res.id;
                document.getElementById('title').value = res.title;
                document.getElementById('url').value = res.url;
                document.getElementById('thumbnail').value = res.thumbnail;
                document.getElementById('publish_date').value = res.publishDate;
                document.getElementById('duration').value = res.duration;
                document.getElementById('create_at').value = res.createAt;
                document.getElementById('update_at').value = res.updateAt;
                document.getElementById('views').value = res.views;
                document.getElementById('type').value = res.type;
                document.getElementById('hidden').value = res.hidden;
            })
        }
    }
)

document.getElementById('submit').addEventListener('click', ev => {
    var obj = {};
    obj.id = parseInt(document.getElementById('id').value);
    obj.title = document.getElementById('title').value;
    obj.url = document.getElementById('url').value;
    obj.thumbnail = document.getElementById('thumbnail').value;
    obj.publishDate = document.getElementById('publish_date').value;
    obj.duration = parseInt(document.getElementById('duration').value);
    obj.createAt = parseInt(document.getElementById('create_at').value);
    obj.updateAt = parseInt(document.getElementById('update_at').value);
    obj.views = parseInt(document.getElementById('views').value);
    obj.type = parseInt(document.getElementById('type').value);
    obj.hidden = document.getElementById('hidden').checked;
    fetch(`/api/video/update`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(obj)
    })
        .then(res => res.text())
        .then(res => {
            console.log(res)
        });
});