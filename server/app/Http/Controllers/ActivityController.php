<?php

namespace App\Http\Controllers;

use App\Models\Activity;
use Illuminate\Http\Request;

class ActivityController extends Controller
{
    public function store(Request $request)
    {
        $activity = new Activity();
        $activity->user_id = auth()->id();
        $activity->action = $request->action;
        $activity->description = $request->description;
        $activity->save();

        return response()->json(['message' => 'Activity created successfully', 'activity' => $activity], 201);
    }

    public function show(Activity $activity)
    {
        return response()->json($activity);
    }

    public function edit(Activity $activity)
    {
        return response()->json($activity);
    }

    public function update(Request $request, Activity $activity)
    {
        $activity->user_id = auth()->id();
        $activity->action = $request->action;
        $activity->description = $request->description;
        $activity->save();

        return response()->json(['message' => 'Activity updated successfully', 'activity' => $activity]);
    }

    public function destroy(Activity $activity)
    {
        $activity->delete();
        return response()->json(['message' => 'Activity deleted successfully']);
    }
}
