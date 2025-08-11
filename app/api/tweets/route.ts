import { NextRequest } from 'next/server';
import { TwitterService } from '../../../lib/twitter-service';
import { UserData } from '../../../types';
import { transformPostsForAI } from '../../../utils/twitter-transformer';
import { getTwitterHighQualityAvatar } from '../../../utils/twitterAvatar';

// export const runtime = 'edge'; // 添加 Edge Runtime 支持

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const handle = searchParams.get('handle');

  if (!handle) {
    return new Response(JSON.stringify({ error: 'Missing handle parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  try {
    const twitterService = new TwitterService();

    // 获取第一页推文
    const userTweets = await twitterService.getUserPost(handle, {
      limit: 40, // 设置推文数量限制为40条
      include_replies: false, // 不包含回复
      include_pinned: true, // 包含置顶推文
      continuation_token: 'DAAHCgABGrfC7IL__-sLAAIAAAATMTkyNTA0MjI1ODM3OTcxODk3NQgAAwAAAAIAAA',
    });

    if (!userTweets.success) {
      throw new Error('获取推文失败');
    }

    let allTweets = userTweets.data.data || [];
    let continuationToken = userTweets.data.continuation_token;

    console.log(`📊 第1页获取到 ${allTweets.length} 条推文`);

    // 如果第一页已经达到40条，就不再获取更多
    const maxTweets = 40;
    let pageCount = 1;
    const maxPages = 5;

    while (continuationToken && pageCount < maxPages && allTweets.length < maxTweets) {
      console.log(`📄 获取第 ${pageCount + 1} 页推文...`);

      const nextPage = await twitterService.getUserPost(handle, {
        limit: 40,
        include_replies: false,
        include_pinned: true,
        continuation_token: continuationToken,
      });

      if (nextPage.success && nextPage.data.data) {
        const newTweets = nextPage.data.data;

        // 过滤掉已存在的推文（基于 tweet_id）
        const existingIds = new Set(allTweets.map((tweet) => tweet.tweet_id));
        const uniqueNewTweets = newTweets.filter((tweet) => !existingIds.has(tweet.tweet_id));

        const remainingSlots = maxTweets - allTweets.length;

        if (remainingSlots > 0 && uniqueNewTweets.length > 0) {
          // 只添加需要的推文数量
          const tweetsToAdd = uniqueNewTweets.slice(0, remainingSlots);
          allTweets = [...allTweets, ...tweetsToAdd];
          pageCount++;
          console.log(
            `📊 第${pageCount}页获取到 ${tweetsToAdd.length} 条推文 (去重后: ${newTweets.length} -> ${uniqueNewTweets.length})`,
          );

          // 如果没有更多唯一推文，停止分页
          if (uniqueNewTweets.length === 0) {
            console.log(`📊 没有更多唯一推文，停止分页`);
            break;
          }
        } else {
          console.log(`📊 已达到最大推文数量限制 ${maxTweets} 条`);
          break;
        }

        continuationToken = nextPage.data.continuation_token;
      } else {
        console.log('❌ 获取下一页失败，停止分页');
        break;
      }
    }

    console.log(`📊 总共获取到 ${allTweets.length} 条推文（${pageCount} 页）`);

    // 从第一条推文中构建userDetails
    const firstTweet = allTweets[0];
    const userDetails = firstTweet
      ? {
          username: handle,
          display_name: firstTweet.user?.name || handle,
          profile_image_url: firstTweet.user?.profile_pic_url,
          description: firstTweet.user?.description || '',
        }
      : {
          username: handle,
          display_name: handle,
          profile_image_url: getTwitterHighQualityAvatar(''),
          description: '',
        };

    const responseData: UserData = {
      success: true,
      data: {
        tweets: transformPostsForAI(allTweets),
        userDetails,
      },
    };

    return new Response(JSON.stringify(responseData), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('获取推文失败:', error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : '获取推文失败',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    );
  }
}
