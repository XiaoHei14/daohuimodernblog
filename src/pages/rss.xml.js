import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';

export async function GET(context) {
    const posts = await getCollection('blog');
    return rss({
        title: SITE_TITLE,
        description: SITE_DESCRIPTION,
        site: context.site,
        items: posts.map((post) => ({
            title: post.data.title,
            description: post.data.description,
            pubDate: post.data.pubDate, // 如果你的 markdown 裡面是用 date，請改成 post.data.date
            link: `/blog/${post.id}/`,
            // 如果你想保留其他自定義欄位（例如 author, heroImage 等），可以加在這邊
            content: post.body,
        })),
    });
}