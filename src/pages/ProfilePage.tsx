import { useState } from 'react';
import { Button } from '../components/common/Button';
import { Card, CardContent, CardTitle } from '../components/common/Card';

const ProfilePage = () => {
  const [isEditing, setIsEditing] = useState(false);

  const userInfo = {
    name: 'Alex Johnson',
    email: 'alex.johnson@example.com',
    joined: 'September 2025',
    bio: 'Food enthusiast and amateur chef. I love trying new recipes and sharing them with friends and family.',
    preferences: ['Italian', 'Thai', 'Mexican', 'Vegetarian'],
    allergies: ['Peanuts', 'Shellfish'],
    recipesCreated: 12,
    shoppingLists: 5,
    mealPlans: 3
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-neutral-800">User Profile</h1>
        <Button
          variant={isEditing ? 'primary' : 'outline'}
          onClick={() => setIsEditing(!isEditing)}
        >
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      {/* User info card */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <span className="text-4xl font-bold text-primary-600">
                  {userInfo.name.split(' ').map(n => n[0]).join('')}
                </span>
              </div>
              {isEditing ? (
                <Button size="sm" variant="outline">Change Photo</Button>
              ) : (
                <div className="text-center text-sm text-neutral-500">Member since<br />{userInfo.joined}</div>
              )}
            </div>

            <div className="flex-1">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Name</label>
                  {isEditing ? (
                    <input
                      type="text"
                      defaultValue={userInfo.name}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                    />
                  ) : (
                    <div className="text-lg font-medium">{userInfo.name}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      defaultValue={userInfo.email}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                    />
                  ) : (
                    <div>{userInfo.email}</div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">Bio</label>
                  {isEditing ? (
                    <textarea
                      defaultValue={userInfo.bio}
                      rows={3}
                      className="w-full p-2 border border-neutral-300 rounded-md"
                    />
                  ) : (
                    <div className="text-neutral-600">{userInfo.bio}</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Food preferences */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <CardTitle className="mb-4">Food Preferences</CardTitle>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Cuisines I Like</h3>
            <div className="flex flex-wrap gap-2">
              {userInfo.preferences.map((pref) => (
                <div key={pref} className="bg-primary-50 text-primary-700 px-3 py-1 rounded-full text-sm">
                  {pref}
                  {isEditing && (
                    <button className="ml-2 text-primary-500 hover:text-primary-700">×</button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-sm">
                  + Add
                </button>
              )}
            </div>
          </div>
          
          <div>
            <h3 className="text-sm font-medium text-neutral-700 mb-2">Allergies & Restrictions</h3>
            <div className="flex flex-wrap gap-2">
              {userInfo.allergies.map((allergy) => (
                <div key={allergy} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                  {allergy}
                  {isEditing && (
                    <button className="ml-2 text-red-500 hover:text-red-700">×</button>
                  )}
                </div>
              ))}
              {isEditing && (
                <button className="bg-neutral-100 text-neutral-600 px-3 py-1 rounded-full text-sm">
                  + Add
                </button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <Card>
        <CardContent className="p-6">
          <CardTitle className="mb-4">Activity</CardTitle>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-neutral-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{userInfo.recipesCreated}</div>
              <div className="text-sm text-neutral-600">Recipes Created</div>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{userInfo.shoppingLists}</div>
              <div className="text-sm text-neutral-600">Shopping Lists</div>
            </div>
            
            <div className="bg-neutral-50 p-4 rounded-lg text-center">
              <div className="text-3xl font-bold text-primary-600 mb-1">{userInfo.mealPlans}</div>
              <div className="text-sm text-neutral-600">Meal Plans Created</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfilePage;
