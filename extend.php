<?php

namespace ClarkWinkelmann\MassActions;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extend;
use Flarum\User\User;

function hasGlobalOrScopedPermission(User $actor, string $permission): bool
{
    if ($actor->hasPermission($permission)) {
        return true;
    }

    // Same logic as Tag::scopeWhereHasPermission
    // Benefits of re-implementing: no need to check Tags is enabled + extension loading order doesn't matter
    // Downside: if you disable Tags while scopes existed, those will still be read
    foreach ($actor->getPermissions() as $thisPermission) {
        if (substr($thisPermission, 0, 3) === 'tag' && strpos($thisPermission, $permission) !== false) {
            return true;
        }
    }

    return false;
}

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/resources/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/resources/locale'),

    (new Extend\ApiSerializer(ForumSerializer::class))
        ->attribute('canHideDiscussionsSometime', function (ForumSerializer $serializer) {
            return hasGlobalOrScopedPermission($serializer->getActor(), 'discussion.hide');
        })
        ->attribute('canLockDiscussionsSometime', function (ForumSerializer $serializer) {
            return hasGlobalOrScopedPermission($serializer->getActor(), 'discussion.lock');
        }),
];
