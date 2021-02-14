/* jshint esversion: 6 */
const
  app_path = location.href.replace(/[^/]*$/, ''),
  js_path = import.meta.url.replace(/[^/]*$/, ''),
  //mdlibs = ['markdown-it.min.js', 'markdown-it-emoji.min.js', 'markdown-it-mark.min.js', 'highlight.min.js'],
  mdlibs =['nimbiCMS.worker.min.js'],
  renderer = data => {
    const md = globalThis.markdownit({
      linkify: true,
      typographer: true,
      highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
          try {
            return hljs.highlight(lang, str).value;
          } catch (e) {
            console.error(e);
          }
        }
        return '';
      }
    })
      .use(globalThis.markdownitMark)
      .use(globalThis.markdownitEmoji);
    fetch(data.src)
      .then(r => {
        if (!r.ok) {
          throw new Error('Network response was not ok');
        }
        return r.text();
      })
      .then(t => {
        postMessage({
          "html": md.render(t),
          "id": data.id
        });
      });
  },
  builder = (src, target) => {
    //debugger;
    let c = document.querySelector(`#${src.data.id}`);
    c.innerHTML = src.data.html;
  },
  search = txt => { }
  ;



const
  init = () => {
    fetch(`${app_path}nimbi.json`)
      .then(r => {
        if (!r.ok) {
          throw new Error('Network response was not ok');
        }
        return r.json();
      })
      .then(j => {
        window.nimbi = window.nimbi || {};
        nimbi.config = j;
        nimbi.minion = minion(renderer, builder, mdlibs, true);

        const
          nav = newelem('nav', 'navbar'),
          navlist = newelem('ul', ''),
          contents = newelem('div', '');

        nimbi.config.items.forEach(k => {
          const id = '_' + hashCode(k.title); //makeID(8);
          let n = newelem('li', '');
          let a = newelem('a', 'tab', { "href": `#${id}` });
          a.innerText = k.title;
          n.appendChild(a);
          navlist.appendChild(n);
          let c = newelem('div', 'page', { "id": id });
          if (k.src) {
            nimbi.minion.postMessage([{
              "src": `${app_path}${j.folder}/${k.src}`,
              "id": id
            }]);
          } else {

          }
          contents.appendChild(c);
        });
        nav.appendChild(navlist);
        document.body.appendChild(nav);
        document.body.appendChild(contents);

        const
          tabs = document.querySelectorAll(".tab"),
          pages = document.querySelectorAll(".page"),
          scrollToTop = document.querySelector(".scrollToTop"),
          observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
              if (entry.isIntersecting) {
                const index = Array.from(pages).indexOf(entry.target);
                tabs.forEach(tab => {
                  tab.classList.remove("activeTab");
                });
                tabs[index].classList.add("activeTab");
                window.location.hash = entry.target.id;
              }
            });
          }, {
            threshold: 0.25
          });
        pages.forEach(page => {
          observer.observe(page);
        });

        // TODO: build infinite scrolling for blog

        // TODO: build ToC and link to articles in blog

      });
  };



const
  minion = (f, onmessage, libs, persist) => {
    const
      target = `
        ${(libs && libs.length > 0) ? `importScripts(${'"' + libs.map(l => js_path + l).join('","') + '"'});` : ''}
        const app_path = '${app_path}';
        onmessage = function (o){let _func = ${f.toString()};
        _func.apply(null, o.data);
        ${(!persist) ? 'self.close();}' : '}'}`,
      mission = URL.createObjectURL(new Blob([target], { 'type': 'text/javascript' })),
      m = new Worker(mission/* , { type: 'module' } */);
    m.onmessage = onmessage;
    return m;
  },
  makeID = n => {
    let text = '',
      d,
      r,
      s,
      possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
      p = possible.length;
    for (var i = 0; i < n; i++) {
      d = Date.now();
      s = (window.crypto) ? window.crypto.getRandomValues(new Uint32Array(1))[0] / 0x100000000 : Math.random();
      r = (d + s * p) % p | 0;
      text += possible.charAt(r);
    }
    return text;
  },
  hashCode= str => {
    var hash = 0, i, chr;
    for (i = 0; i < str.length; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash.toString(16);
  },
  newelem = (tag, classes, attribs) => {
    const c = document.createElement(tag);
    if (classes && classes !== '') c.className = classes; // as space-separated list
    if (attribs) {
      for (var key in attribs) {
        c.setAttribute(key, attribs[key]);
      }
    }
    return c;
  }
  ;






init();
