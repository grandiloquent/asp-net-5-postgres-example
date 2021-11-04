(function () {

    function covertJSON(obj) {
        const result = {};
        result.description = obj.description;
        result.authors = obj.authors.reduce((a, b) => a.name + ' | ' + b.name, '');
        result.title = obj.title;
        result.publishers = obj.publishers.reduce((a, b) => a.name + ' | ' + b.name, '');
        result.language = "en";
        result.star = 0;
        result.datetime = obj.issued;
        navigator.clipboard.writeText(result);
    }

    const json = {

        "authors": [{"name": "Joe McNally"}],
        "subjects": [],
        "topics": [{
            "name": "Photography",
            "slug": "photography",
            "score": -0.957833040573252,
            "uuid": "6dcb21c5-c1c2-4f70-a558-422c21ab3527",
            "epub_identifier": "9781681988023"
        }],
        "publishers": [{"id": 1, "name": "Rocky Nook", "slug": "rocky-nook"}],
        "chapters": ["https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/cover.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/title.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/copyright.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/fm.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/dedication.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/acknowledgments.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/contents.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter1.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter2.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter3.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter4.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter5.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter5-1.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter6.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter7.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter8.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter9.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter9-1.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter10.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter11.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter12.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter13.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter14.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter15.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter15-1.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter16.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter17.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter17-1.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter18.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter19.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter20.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter21.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter22.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter23.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter24.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter25.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter26.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter27.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter28.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter29.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter30.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter30-1.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter31.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter31-1.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter32.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter33.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter34.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter35.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/chapter36.xhtml", "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/xhtml/newsletter.xhtml"],
        "cover": "https://learning.oreilly.com/library/cover/9781681988023/",
        "chapter_list": "https://learning.oreilly.com/api/v1/book/9781681988023/chapter/",
        "toc": "https://learning.oreilly.com/api/v1/book/9781681988023/toc/",
        "flat_toc": "https://learning.oreilly.com/api/v1/book/9781681988023/flat-toc/",
        "web_url": "https://learning.oreilly.com/library/view/the-real-deal/9781681988023/",
        "academic_excluded": false,
        "opf_unique_identifier_type": "uid",
        "created_time": "2021-10-21T00:56:03.936847Z",
        "last_modified_time": "2021-10-21T00:59:25.308170Z",
        "identifier": "9781681988023",
        "title": "The Real Deal",
        "format": "book",
        "content_format": "book",
        "source": "application/epub+zip",
        "orderable_title": "The Real Deal",
        "description": "<span><p><b>Photographer and best-selling author Joe McNally shares stories and lessons from a life in photography.</b></p><p>When Joe McNally moved to New York City in 1976, his first job was at the <i>Daily News</i> as a copyboy, “the wretched dog of the newsroom.” He was earning the lowest pay grade possible and living in a cheap hotel in Manhattan. Life was not glamorous. But with a fierce drive, an eye for a picture, and a willingness to take (almost) any assignment that came his way, Joe stepped out onto the always precarious tightrope of the freelance photographer—and never looked back. Fast forward 40 years, and his work has included assignments and stories for <i>National Geographic</i>, <i>Time</i>, <i>LIFE</i>, <i>Sports Illustrated</i>, and more. He has traveled for assignments to nearly 70 countries and received dozens of awards for his photography.</p><p>In <i>The Real Deal</i>, Joe tells us how it all started, and candidly shares stories, lessons, and insights he has collected along the way. This is not a dedicated how-to book about “where to put the light,” though there is certainly instructional information to be gleaned here. This is also not a navel-gazing look back at “the good old days,” because those never really existed anyway. Instead, <i>The Real Deal</i> is simply a collection of candid “field notes”—some short, some quite long—gathered over time that, together, become an intimate look behind the scenes at a photographer who has pretty much seen and done it all.</p><p>Though the photography industry bears little resemblance to the industry just 10 years ago (much less 40 years ago), what it really takes to become a successful photographer—the character traits, the fundamental lessons, the ability to adapt, and then adapt again—remains the same. Joe writes about everything from the crucial ability to know how to use (and make!) window light to the importance of creating long-term relationships built on trust; from lessons learned after a day in the field to the need to follow your imagination wherever it takes you; from the “random” and “lucky” moments that propel one’s career to the wonders and pitfalls of today’s camera technology. For every mention of f-stops and shutter speeds, there is equal discussion about the importance of access, the occasional moment of hubris, and the idea of becoming iconic.</p><p>Before Joe was a celebrated and award-winning photographer, before he was a well-respected educator and author of multiple bestselling books, he was just…Joe, hustling every day, from one assignment to the next, piecing together a portfolio, a skill set, a reputation, a career. He imagined a life—and then took pictures of it. Here are a few frames.</p></span>",
        "isbn": "9781681988023",
        "issued": "2021-10-19",
        "updated": "2021-10-21T00:59:25.308170Z",
        "orderable_author": "McNally, Joe",
        "publisher_resource_links": {},
        "is_active": true,
        "is_hidden": false,
        "virtual_pages": 526,
        "duration_seconds": null,
        "pagecount": 348,
        "language": "en"
    };
})();