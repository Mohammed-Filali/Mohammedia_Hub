<?php

namespace App\Http\Controllers;

use App\Models\Poll;
use App\Models\Vote;
use Illuminate\Http\Request;

class PollController extends Controller
{
    // Get all polls
    public function index()
    {
        $polls = Poll::withCount(['votes as accept_count' => function ($query) {
            $query->where('vote', 'accept');
        }, 'votes as refuse_count' => function ($query) {
            $query->where('vote', 'refuse');
        }])->get();

        return response()->json($polls);
    }

    // Create a new poll
    public function store(Request $request)
    {
        $request->validate(['question' => 'required|string']);
        $poll = Poll::create($request->only('question'));
        return response()->json($poll, 201);
    }

    // Vote on a poll
    public function vote(Request $request, Poll $poll)
    {
        $request->validate(['vote' => 'required|in:accept,refuse']);
        $user = auth()->user(); // Ensure you have authentication set up

        // Check if the user has already voted
        if ($poll->votes()->where('user_id', $user->id)->exists()) {
            return response()->json(['message' => 'You have already voted on this poll.'], 403);
        }

        // Record the vote
        $poll->votes()->create([
            'user_id' => $user->id,
            'vote' => $request->vote,
        ]);

        if ($user) {
            $user->activities()->create([
            'user_id' => $user->id,
            'action' => 'Vote enregistré',
            'description' => 'Vous avez voté "' . $request->vote . '" pour le sondage avec la question: "' . $poll->question . '"',
            ]);
        }

        return response()->json(['message' => 'Vote recorded successfully.']);
    }

    // Get the last votes with user and poll details
    public function lastVotes()
    {
        $votes = Vote::with(['user', 'poll'])
            ->latest()
            ->take(10)
            ->get();

        return response()->json($votes);
    }
}
