import { getCollection } from 'astro:content';

export async function getPublishedPosts() {
    const posts = await getCollection('blog', ({ data }) =>
        // 正式建置時排除草稿；本機 dev 仍顯示，方便預覽
        import.meta.env.PROD ? !data.draft : true,
    );
    return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}