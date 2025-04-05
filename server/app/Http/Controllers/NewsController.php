<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\News as NewsModel;
use App\Models\User;

class NewsController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $userId = $user ? $user->id : null;

        $news = NewsModel::with(['likes'])->get()->map(function ($item) use ($userId) {
            $userReaction = $userId ? $item->likes->where('user_id', $userId)->first() : null;

            return [
                'id' => $item->id,
                'title' => $item->title,
                'image' => $item->image ? asset('storage/' . $item->image) : null,
                'description' => $item->description,
                'likes_count' => $item->likes_count,
                'dislikes_count' => $item->dislikes_count,
                'comments_count' => $item->comments_count,
                'comments' => $item->getComments(),
                'user_has_liked' => $userReaction ? $userReaction->is_liked : false,
                'user_has_disliked' => $userReaction ? $userReaction->is_disliked : false,
            ];
        });

        return response()->json($news);
    }

    public function show($id)
    {
        $news = NewsModel::find($id);

        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }

        return response()->json($news);
    }

    public function store(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('news', 'public');
            $validatedData['image'] = $imagePath;
        }

        $news = NewsModel::create($validatedData);

        return response()->json($news, 201);
    }

    // Update an existing news item
    public function update(Request $request, $id)
    {
        $news = NewsModel::find($id);

        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }

        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        $news->update($validatedData);

        return response()->json($news);
    }

    // Delete a news item
    public function destroy($id)
    {
        $news = NewsModel::find($id);

        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }

        $news->delete();

        return response()->json(['message' => 'News deleted successfully']);
    }



    public function like($id, $Uid)
    {
        $news = NewsModel::find($id);
        $user = User::find($Uid);

        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Check if user already has a reaction
        $existingReaction = $news->likes()
            ->where('user_id', $user->id)
            ->first();

        if ($existingReaction) {
            if ($existingReaction->is_liked) {
                // User is unliking (toggle off)
                $existingReaction->delete();
                $action = 'removed';
            } else {
                // Change from dislike to like
                $existingReaction->update([
                    'is_liked' => true,
                    'is_disliked' => false
                ]);
                $action = 'added';
            }
        } else {
            // New like
            $news->likes()->create([
                'user_id' => $user->id,
                'is_liked' => true,
                'is_disliked' => false
            ]);
            $action = 'added';
        }

        // Update counts
        $news->refresh(); // Refresh to get latest counts
        $likesCount = $news->likes()->where('is_liked', true)->count();
        $dislikesCount = $news->likes()->where('is_disliked', true)->count();

        $news->update([
            'likes_count' => $likesCount,
            'dislikes_count' => $dislikesCount
        ]);

        return response()->json([
            'message' => 'Like ' . $action . ' successfully',
            'likes_count' => $likesCount,
            'dislikes_count' => $dislikesCount,
            'user_has_liked' => $action === 'added',
            'user_has_disliked' => false
        ]);
    }

    public function dislike($id, $Uid)
    {
        $news = NewsModel::find($id);
        $user = User::find($Uid);

        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        // Check if user already has a reaction
        $existingReaction = $news->likes()
            ->where('user_id', $user->id)
            ->first();

        if ($existingReaction) {
            if ($existingReaction->is_disliked) {
                // User is undisliking (toggle off)
                $existingReaction->delete();
                $action = 'removed';
            } else {
                // Change from like to dislike
                $existingReaction->update([
                    'is_liked' => false,
                    'is_disliked' => true
                ]);
                $action = 'added';
            }
        } else {
            // New dislike
            $news->likes()->create([
                'user_id' => $user->id,
                'is_liked' => false,
                'is_disliked' => true
            ]);
            $action = 'added';
        }

        // Update counts
        $news->refresh(); // Refresh to get latest counts
        $likesCount = $news->likes()->where('is_liked', true)->count();
        $dislikesCount = $news->likes()->where('is_disliked', true)->count();

        $news->update([
            'likes_count' => $likesCount,
            'dislikes_count' => $dislikesCount
        ]);

        return response()->json([
            'message' => 'Dislike ' . $action . ' successfully',
            'likes_count' => $likesCount,
            'dislikes_count' => $dislikesCount,
            'user_has_liked' => false,
            'user_has_disliked' => $action === 'added'
        ]);
    }

    public function comment(Request $request, $id , $Uid)
    {
        $validatedData = $request->validate([
            'comment' => 'required|string|max:255',
        ]);
        $news = NewsModel::find($id);
        $user = User::find($Uid); // Ensure you have authentication set up
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        if (!$news) {
            return response()->json(['message' => 'News not found'], 404);
        }


        $comment =$validatedData['comment'];

        if ($comment) {
                $news->likes()->create([
                    'user_id' => $user->id,
                    'comment' => $comment
                ]);


        } else {
            return response()->json(['message' => 'Invalid request'], 400);
        }

        return response()->json(['message' => 'Comment added successfully']);
    }
}
