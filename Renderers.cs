using Markdig.Renderers;
using Markdig.Renderers.Html;
using Markdig.Syntax;
using Markdig.Syntax.Inlines;
using Leisn.MarkdigToc;

namespace Psycho
{
    using System;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Text;
    using System.Text.RegularExpressions;
    using Markdig;
    using Microsoft.AspNetCore.Hosting;
    using NUglify;

    public static class Renderers
    {
        public static void Renderer(List<Tuple<int, string, string>> templates,
            StringBuilder sb, object data)
        {
            for (var i = 0; i < templates.Count; i++)
            {
                switch (templates[i].Item1)
                {
                    case 0:
                        {
                            sb.Append(templates[i].Item2.ToString());
                            break;
                        }
                    case 1:
                        {
                            RenderItem1(templates[i], data, sb);
                            break;
                        }
                    case 2:
                        {
                            if (data is Dictionary<string, dynamic> items)
                            {
                                if (items.GetValueOrDefault("netDisks", null) != null)
                                    sb.Append(templates[i].Item3);
                            }

                            break;
                        }
                    case 3:
                        {
                            RenderItem3(templates[i], data, sb);
                            break;
                        }
                    case 4:
                        {
                            // sb.Append(
                            //     await RenderPartialAsync(templates[i].Item2, p.Environment, book)
                            //         .ConfigureAwait(false));
                            break;
                        }
                    case 6:
                        {
                            RenderItem6(templates[i], data, sb);
                            break;
                        }
                    case 7:
                        {
                            RenderItem7(templates[i], data, sb);
                            break;
                        }
                    case 8:
                        {
                            RenderItem8(templates[i], data, sb);
                            break;
                        }
                    case 9:
                        {
                            RenderItem9(templates[i], data, sb);
                            break;
                        }
                    case 10:
                        {
                            i = RenderItem10(templates, templates[i], data, sb, i);
                            break;
                        }
                    case 11:
                        {
                            var ls = new List<object>();
                            var parameters = templates[i].Item3.Split('|');
                            foreach (var parameter in parameters)
                            {
                                if (parameter.StartsWith('(') && parameter.EndsWith(')'))
                                {
                                    ls.Add(parameter.AsSpan().Slice(1, parameter.Length - 2).ToString());
                                }
                                // else if(Regex.IsMatch(parameter,"\\[\\d+\\]\\."))
                                // {
                                //     var pieces = Regex.Split(parameter, "\\[\\d+\\]\\.");
                                //     var listValue = RenderShare.GetPropertyValue(book, pieces[
                                //     int.Parse(Regex.Match(parameter, "(?<=\\[)\\d+(?=\\]\\.)").Value)
                                //     ]) as IEnumerable<object>;
                                //     ls.Add(RenderShare.GetPropertyValue(listValue.ElementAt(0),pieces[1]));
                                // }
                                else
                                {
                                    var p = data.GetType().GetProperty(parameter);

                                    ls.Add(p.GetValue(data));
                                }
                            }

                            var value = Shared.CallStaticMethod(typeof(Shared),
                                templates[i].Item2, ls.ToArray());
                            if (value != null)
                            {
                                sb.Append(value);
                            }

                            break;
                        }
                }
            }
        }

        private static void RenderItem9(Tuple<int, string, string> m, object data,
            StringBuilder sb)
        {
            var pipeline = new MarkdownPipelineBuilder().UseAutoLinks()
                .UseCustomContainers()
                .UseGenericAttributes()
                .UseAdvancedExtensions()
.UseTableOfContent()
                .Build();

            MarkdownDocument doc;
            if (data is Dictionary<string, dynamic> datas)
                doc = Markdown.Parse(datas[m.Item2], pipeline);
            else
            {
                var str = data.GetType().GetProperty(m.Item2)?.GetValue(data) as string ?? string.Empty;
                str = str.Replace("\n", "\r\n");
                doc = Markdown.Parse(str, pipeline);
            }

            // Process headings to insert an intermediate LinkInline
            foreach (var l in doc.Descendants<LinkInline>().Where(x => x.IsImage))
            {
                var h = new HtmlAttributes();
                h.AddProperty("data-src", "//static.lucidu.cn/images/" + l.Url);
                l.SetAttributes(h);
                l.Url = string.Empty;
            }

            // Render the doc
            var writer = new StringWriter();
            var renderer = new HtmlRenderer(writer);
            pipeline.Setup(renderer);
            renderer.Render(doc);
            sb.Append(writer);
        }

        public static string
            RenderPartialAsync(string key, IWebHostEnvironment environment, object data)
        {
            var sb = new StringBuilder();
            // var content =
            //     (await $"{key}.html".ReadContentFile(environment, "templates"))
            //     .ParseStringTemplate();
            // foreach (Tuple<int, string, string> m in content)
            // {
            //     if (m.Item1 == 0)
            //     {
            //         sb.Append(m.Item2.ToString());
            //     }
            //     else if (m.Item1 == 1)
            //     {
            //         RenderItem1(m, data, sb);
            //     }
            //     else if (m.Item1 == 3)
            //     {
            //         RenderItem3(m, data, sb);
            //     }
            // }
            return sb.ToString();
        }

        private static void RenderItem1(Tuple<int, string, string> m, object data,
            StringBuilder sb)
        {
            if (data is Dictionary<string, dynamic>)
            {
                if ((data as Dictionary<string, dynamic>)
                    .TryGetValue(m.Item2, out var value))
                {
                    if (value != null)
                        sb.Append(value);
                }
            }
            else
            {
                var o = data.GetType().GetProperty(m.Item2);
                sb.Append(o?.GetValue(data));
            }
        }

        private static void RenderItem3(Tuple<int, string, string> m, object data,
            StringBuilder sb)
        {
            if (data is Dictionary<string, dynamic> datas)
            {
                if (datas.TryGetValue(m.Item2, out var value))
                {
                    if (value == null)
                        value = m.Item3;
                    sb.Append(value);
                }
                else
                {
                    sb.Append(m.Item3);
                }
            }
            else
            {
                sb.Append(data.GetType().GetProperty(m.Item2)?.GetValue(data) ?? m.Item3);
            }
        }

        private static void RenderItem6(Tuple<int, string, string> m, object data,
            StringBuilder sb)
        {
            var p = data.GetType().GetProperty(m.Item2);
            sb.Append(new DateTime(1970, 1, 1, 0, 0, 0, 0, DateTimeKind.Utc)
                .AddSeconds((long)p.GetValue(data))
                .ToLocalTime()
                .ToString("yyyy年MM月dd日"));
        }

        private static void RenderItem7(Tuple<int, string, string> m, object data,
            StringBuilder sb)
        {
            if (m.Item2 == "Authors" || m.Item2 == "Publishers")
            {
                sb.Append(
                    Uri.EscapeUriString((data.GetType().GetProperty(m.Item2)?.GetValue(data) as List<string>)?[0] ??
                                        string.Empty));
            }
            else if (m.Item2 == "^")
            {
                sb.Append(Uri.EscapeUriString(data.ToString() ?? string.Empty));
            }
        }

        private static void RenderItem8(Tuple<int, string, string> m, object data,
            StringBuilder sb)
        {
            sb.Append(data.ToString());
        }

        private static int RenderItem10(List<Tuple<int, string, string>> content,
            Tuple<int, string, string> m, object data,
            StringBuilder sb, int i)
        {
            var j = content.Count;
            var index = i;
            if (m.Item2 == "foreach")
            {
                var p = data.GetType().GetProperty(m.Item3);
                var pieces = (p != null ? p.GetValue(data) : null) as IEnumerable<object>;
                var enumerable = pieces as object[] ?? (pieces ?? Array.Empty<object>()).ToArray();
                if (!enumerable.Any())
                {
                    for (var k = i + 1; k < j; k++)
                    {
                        if (content[k + 1].Item1 == 10 && content[k + 1].Item2 == "end")
                        {
                            return k + 1;
                        }
                    }
                }

                var offset = 0;
                foreach (var element in enumerable)
                {
                    for (var k = i + 1; k < j; k++)
                    {
                        if (content[k].Item1 == 5)
                        {
                            // 传入原始数据
                            RenderItem1(content[k], data, sb);
                        }
                        else if (content[k].Item1 == 1)
                        {
                            if (content[k].Item2 == "Instructors" ||
                                content[k].Item2 == "Publishers")
                            {
                                sb.Append(
                                    (element.GetType().GetProperty(content[k].Item2).GetValue(element) as List<string>)
                                    ?.First());
                            }
                            else
                                RenderItem1(content[k], element, sb);
                        }
                        else if (content[k].Item1 == 6)
                        {
                            RenderItem6(content[k], element, sb);
                        }
                        else if (content[k].Item1 == 7)
                        {
                            RenderItem7(content[k], element, sb);
                        }
                        else if (content[k].Item1 == 8)
                        {
                            RenderItem8(content[k], element, sb);
                        }
                        else if (content[k].Item1 == 11)
                        {
                            var ls = new List<object>();
                            var parameters = content[k].Item3.Split('|');
                            foreach (var parameter in parameters)
                            {
                                if (parameter.StartsWith('(') && parameter.EndsWith(')'))
                                {
                                    ls.Add(parameter.AsSpan().Slice(1, parameter.Length - 2).ToString());
                                }
                                // else if(Regex.IsMatch(parameter,"\\[\\d+\\]\\."))
                                // {
                                //     var pieces = Regex.Split(parameter, "\\[\\d+\\]\\.");
                                //     var listValue = RenderShare.GetPropertyValue(book, pieces[
                                //     int.Parse(Regex.Match(parameter, "(?<=\\[)\\d+(?=\\]\\.)").Value)
                                //     ]) as IEnumerable<object>;
                                //     ls.Add(RenderShare.GetPropertyValue(listValue.ElementAt(0),pieces[1]));
                                // }
                                else
                                {
                                    ls.Add(element.GetType().GetProperty(parameter).GetValue(element));
                                }
                            }

                            var value = Shared.CallStaticMethod(typeof(Shared),
                                content[k].Item2, ls.ToArray());
                            if (value != null)
                            {
                                sb.Append(value);
                            }
                        }
                        else
                        {
                            sb.Append(content[k].Item2);
                        }

                        if (content[k + 1].Item1 == 10 && content[k + 1].Item2 == "end")
                        {
                            offset = k + 1;
                            break;
                        }
                    }
                }

                index = offset;
            }

            if (m.Item2 == "Css")
            {
                var p = data.GetType().GetProperty("Css");
                var pieces = p != null ? (bool)p.GetValue(data) : false;
                if (pieces == false)
                {
                    sb.Append(m.Item3);
                }
                else
                {
                    var webRootPath = (string)data.GetType().GetProperty("WebRootPath").GetValue(data);
                    var matches = Regex.Matches(m.Item3, "href=\"([^\"]+)\"").Select(m => m.Groups[1].Value);
                    var buffer = new StringBuilder();
                    var prefix = "";
                    foreach (var item in matches)
                    {
                        if (prefix.Length == 0 && item.StartsWith("../"))
                            prefix = "../";
                        buffer.AppendLine(File.ReadAllText(Path.Join(webRootPath, item.SubstringAfterLast("/"))));
                    }

                    var dir = Path.Combine(webRootPath, "Publish");
                    if (!Directory.Exists(dir))
                        Directory.CreateDirectory(dir);
                    var fileName = $"{buffer.ToString().GetHashForString()}.css";
                    File.WriteAllText(
                        Path.Combine(dir, fileName)
                        , Uglify.Css(buffer.ToString()).Code);

                    sb.Append($"<link rel=\"stylesheet\" href=\"{prefix}{fileName}\">");
                }
            }

            if (m.Item2 == "JavaScript")
            {
                var p = data.GetType().GetProperty("Css");
                var pieces = p != null ? (bool)p.GetValue(data) : false;
                if (pieces == false)
                {
                    sb.Append(m.Item3);
                }
                else
                {
                    var webRootPath = (string)data.GetType().GetProperty("WebRootPath")?.GetValue(data);
                    var matches = Regex.Matches(m.Item3, "src=\"([^\"]+)\"").Select(match => match.Groups[1].Value);
                    var buffer = new StringBuilder();
                    var prefix = "";
                    foreach (var item in matches)
                    {
                        if (prefix.Length == 0 && item.StartsWith("../"))
                            prefix = "../";
                        buffer.AppendLine(File.ReadAllText(Path.Join(webRootPath, item.SubstringAfterLast("/"))));
                    }

                    var dir = Path.Combine(webRootPath, "Publish");
                    if (!Directory.Exists(dir))
                        Directory.CreateDirectory(dir);
                    var fileName = $"{buffer.ToString().GetHashForString()}.js";
                    File.WriteAllText(
                        Path.Combine(dir, fileName)
                        , Uglify.Js(buffer.ToString()).Code);

                    sb.Append($"<script src=\"{prefix}{fileName}\"></script>");
                }
            }

            if (m.Item2 == "data")
            {
                var p = data.GetType().GetProperty(m.Item3);
                var element = p.GetValue(data);
                var offset = 0;
                for (var k = i + 1; k < j; k++)
                {
                    if (content[k].Item1 == 5)
                    {
                        // 传入原始数据
                        RenderItem1(content[k], data, sb);
                    }
                    else if (content[k].Item1 == 1)
                    {
                        if (content[k].Item2 == "Instructors" ||
                            content[k].Item2 == "Publishers")
                        {
                            sb.Append(
                                (element.GetType().GetProperty(content[k].Item2).GetValue(element) as List<string>)
                                ?.First());
                        }
                        else
                            RenderItem1(content[k], element, sb);
                    }
                    else if (content[k].Item1 == 6)
                    {
                        RenderItem6(content[k], element, sb);
                    }
                    else if (content[k].Item1 == 7)
                    {
                        RenderItem7(content[k], element, sb);
                    }
                    else if (content[k].Item1 == 8)
                    {
                        RenderItem8(content[k], element, sb);
                    }
                    else if (content[k].Item1 == 9)
                    {
                        RenderItem9(content[k], element, sb);
                    }
                    else if (content[k].Item1 == 11)
                    {
                        var ls = new List<object>();
                        var parameters = content[k].Item3.Split('|');
                        foreach (var parameter in parameters)
                        {
                            if (parameter.StartsWith('(') && parameter.EndsWith(')'))
                            {
                                ls.Add(parameter.AsSpan().Slice(1, parameter.Length - 2).ToString());
                            }
                            // else if(Regex.IsMatch(parameter,"\\[\\d+\\]\\."))
                            // {
                            //     var pieces = Regex.Split(parameter, "\\[\\d+\\]\\.");
                            //     var listValue = RenderShare.GetPropertyValue(book, pieces[
                            //     int.Parse(Regex.Match(parameter, "(?<=\\[)\\d+(?=\\]\\.)").Value)
                            //     ]) as IEnumerable<object>;
                            //     ls.Add(RenderShare.GetPropertyValue(listValue.ElementAt(0),pieces[1]));
                            // }
                            else
                            {
                                ls.Add(element.GetType().GetProperty(parameter).GetValue(element));
                            }
                        }

                        var value = Shared.CallStaticMethod(typeof(Shared),
                            content[k].Item2, ls.ToArray());
                        if (value != null)
                        {
                            sb.Append(value);
                        }
                    }
                    else
                    {
                        sb.Append(content[k].Item2);
                    }

                    if (content[k + 1].Item1 == 10 && content[k + 1].Item2 == "end")
                    {
                        offset = k + 1;
                        break;
                    }
                }

                index = offset;
            }

            return index;
        }
    }
}