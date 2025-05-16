import { createTool } from "@mastra/core/tools";
import { z } from "zod";

/**
 * Qiita API を使用して、指定の記事内容を取得するツール
 */
export const getQiitaPostTool = createTool({
  id: 'get-qiita-post',
  description: 'Qiita API を使用して、指定の記事内容を取得するツール',
  inputSchema: z.object({
    postId: z.string().describe('記事のID'),
  }),
  outputSchema: z.object({
    title: z.string().describe('記事のタイトル'),
    body: z.string().describe('記事の本文'),
    author: z.string().nullable().describe('記事の作者'),
    tags: z.array(z.string()).describe('記事のタグ'),
    createdAt: z.string().describe('記事の作成日時'),
    updatedAt: z.string().describe('記事の更新日時'),
  }),
  execute: async ({ context }: { context: { postId: string } }) => {
    const postData = await getQiitaPost(context.postId);
    return {
      title: postData.title,
      body: postData.body,
      author: postData.user.name ? postData.user.name : postData.user.id,
      tags: postData.tags.map((tag: { name: string }) => tag.name),
      createdAt: postData.created_at,
      updatedAt: postData.updated_at,
    };
  },
});
