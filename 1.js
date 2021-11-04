console.log([...$0.querySelectorAll('tr td:nth-child(2) code>a')]
    .map(i => i.textContent.trim())
    .filter(i => i.startsWith('setOn'))
    .map(i => {
        i = i.indexOf('(') !== -1 ? i.substring(0, i.indexOf('(')) : i;
        let str = i.substr(5);
        str = str.substring(0, str.indexOf('Listener'));
        return `mMediaPlayer.${i}(this::on${str});`;
    }).join('\n'));

(function () {
    const page = 0;
    fetch(`https://learning.oreilly.com/api/v2/search/?query=*&extended_publisher_data=true&highlight=true&include_assessments=false&include_case_studies=true&include_courses=true&include_playlists=true&include_collections=true&include_notebooks=true&include_sandboxes=true&include_scenarios=true&is_academic_institution_account=false&source=user&formats=book&publishers=Apress&publishers=Manning%20Publications&publishers=McGraw-Hill&publishers=No%20Starch%20Press&publishers=O%27Reilly%20Media%2C%20Inc.&publishers=Packt%20Publishing&sort=date_added&facet_json=true&json_facets=true&include_facets=true&include_practice_exams=true&orm-service=search-frontend&page=${page}`)
        .then(res => res.json())
        .then(res => {
            console.error(res.results.map(i => `https://learning.oreilly.com${i.web_url}`).join('\n'));
        })
})()