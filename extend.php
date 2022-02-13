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
        ->attributes(function (ForumSerializer $serializer) {
            return [
                'massControls' => $serializer->getActor()->hasPermission('mass-actions.controls'),
                'canHideDiscussionsSometime' => hasGlobalOrScopedPermission($serializer->getActor(), 'discussion.hide'),
                'canLockDiscussionsSometime' => hasGlobalOrScopedPermission($serializer->getActor(), 'discussion.lock'),
                // The tag edit policy is split between moderator permission and self-edit permission
                // We will only enable the mass control if self tag edit was set to "indefinitely"
                'canTagDiscussionsSometime' => hasGlobalOrScopedPermission($serializer->getActor(), 'discussion.tag') || resolve('flarum.settings')->get('allow_tag_change') === '-1',
            ];
        }),
];
