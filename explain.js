// In this video I will show a basic idea how api structure will be structured.
// all the get request will of each endpoint will response in this format.

/*
 sample url: apiUrl.com/user/users?count-posts=1&count-likes=1&count-comments=1&get-posts=1&get-likes=1&get-comments=1&sortOrder=-1&sortBy=updatedAt&limit=10&page=1
 here in this url we are getting all the users with their posts, likes and comments from a single api call using query parameters. I will show you how this is useful in the video

 explain the query parameters: 
 apiUrl.com/user/users: We're getting user data.
count-posts, count-likes, count-comments: Counts of user's activity.
get-posts, get-likes, get-comments: User's actual activity.
sortOrder=-1 & sortBy=updatedAt: Sort users by recent activity.
limit=10: Get 10 users.
page=1: Get the first page of users.

****************THIS IS VERY USEFUL TO REDUCE THE NUMBER OF API CALLS IN FRONTEND****************

I will show how this api work and how this format api will b useful in your project. This is a dummy api stucture that I created before and I used it frequently in my projects. I will show you how this api structure will be useful in your project.

This api has simple users, posts, likes and comments endpoint. I think you are clear the what will be data relation and purpose of this api.

NOw I will use postman to show you how this api will work. first I will create an user, then user will login, then I will collect the token and use it in the header to access the protected routes. I will create post , comment and like using the token. Then I will show you how this api will work.

//here in user frofile token is collecting from header and then using it to get user profile. here also user id is collecting from token and creating on behalf of user. Now delete the post.
Now check the comment on behalf of this post
Now delete the user 
delete user will collect id t=from token as similar for all enspoint
//now try to access with the token
//user not exist.


API response:
 
{
    "result": {
        "page": {
            "totalIndex": 3,
            "sortOrder": "DESC",
            "sortBy": "updatedAt",
            "currentPage": 1,
            "totalPage": 1,
            "perPage": 10
        },
        "data": [
            {
                "_id": "6420ca3bc883dd831a64a0db",
                "email": "admin@miniwall.com",
                "firstName": "Shekha",
                "lastName": "Maha",
                "createdAt": "2023-03-26T22:42:03.118Z",
                "updatedAt": "2023-03-27T00:14:08.676Z",
                "posts": [
                    {
                        "_id": "6420df5b0b9a17c8988c2e35",
                        "title": "Admin post",
                        "description": "Admin post decription",
                        "createdAt": "2023-03-27T00:12:11.048Z",
                        "updatedAt": "2023-03-27T00:12:11.048Z"
                    }
                ],
                "countPosts": 1,
                "comments": [
                    {
                        "_id": "6420df6b0b9a17c8988c2e3c",
                        "comment": "Admin Comment",
                        "post": "6420df5b0b9a17c8988c2e35",
                        "createdAt": "2023-03-27T00:12:27.659Z",
                        "updatedAt": "2023-03-27T00:12:27.659Z"
                    }
                ],
                "countComments": 1,
                "likes": [],
                "countLikes": 0
            },
            {
                "_id": "6420df120b9a17c8988c2e2d",
                "email": "admin@first.com",
                "firstName": "Opi",
                "lastName": "Tausif",
                "createdAt": "2023-03-27T00:10:58.336Z",
                "updatedAt": "2023-03-27T00:10:58.336Z",
                "posts": [],
                "countPosts": 0,
                "comments": [],
                "countComments": 0,
                "likes": [],
                "countLikes": 0
            },
            {
                "_id": "64207ccec659f07b6f15f922",
                "email": "admin@web.com",
                "firstName": "Maha",
                "lastName": "Shekha",
                "createdAt": "2023-03-26T17:11:42.784Z",
                "updatedAt": "2023-03-26T17:11:42.784Z",
                "posts": [
                    {
                        "_id": "64207d12c659f07b6f15f928",
                        "title": "First post",
                        "description": "first post decription",
                        "createdAt": "2023-03-26T17:12:50.857Z",
                        "updatedAt": "2023-03-26T17:12:50.857Z"
                    }
                ],
                "countPosts": 1,
                "comments": [],
                "countComments": 0,
                "likes": [
                    {
                        "_id": "64207e06d280d2b637cd01eb",
                        "post": "64207d12c659f07b6f15f928",
                        "createdAt": "2023-03-26T17:16:54.694Z",
                        "updatedAt": "2023-03-26T17:16:54.694Z"
                    }
                ],
                "countLikes": 1
            }
        ]
    }
}
*/