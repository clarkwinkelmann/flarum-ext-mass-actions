<?php

namespace ClarkWinkelmann\MassActions;

use Flarum\Api\Serializer\ForumSerializer;
use Flarum\Extension\ExtensionManager;
use Flarum\User\User;

class ForumAttributes
{
    protected $manager;

    public function __construct(ExtensionManager $manager)
    {
        $this->manager = $manager;
    }

    public function __invoke(ForumSerializer $serializer): array
    {
        return [
            'massControls' => $serializer->getActor()->hasPermission('mass-actions.controls'),
            'canHideDiscussionsSometime' => $this->hasGlobalOrScopedPermission($serializer->getActor(), 'discussion.hide'),
            'canDeleteDiscussionsSometime' => $this->hasGlobalOrScopedPermission($serializer->getActor(), 'discussion.delete'),
            'canLockDiscussionsSometime' => $this->hasGlobalOrScopedPermission($serializer->getActor(), 'discussion.lock')
                && $this->manager->isEnabled('flarum-lock'),
            'canStickyDiscussionsSometime' => $this->hasGlobalOrScopedPermission($serializer->getActor(), 'discussion.sticky')
                && $this->manager->isEnabled('flarum-sticky'),
            // The tag edit policy is split between moderator permission and self-edit permission
            // We will only enable the mass control if self tag edit was set to "indefinitely"
            'canTagDiscussionsSometime' => (
                    $this->hasGlobalOrScopedPermission($serializer->getActor(), 'discussion.tag')
                    || resolve('flarum.settings')->get('allow_tag_change') === '-1'
                )
                && $this->manager->isEnabled('flarum-tags'),
        ];
    }

    protected function hasGlobalOrScopedPermission(User $actor, string $permission): bool
    {
        if ($actor->hasPermission($permission)) {
            return true;
        }

        // Skip tag permission check below if Tags is disabled, otherwise inactive scoped permissions still in the database would be read
        if (!$this->manager->isEnabled('flarum-tags')) {
            return false;
        }

        // Same logic as Tag::scopeWhereHasPermission but without retrieving any tag from the database
        // Possible issue: there could be stale scoped permissions still in the database for tag IDs that no longer exist
        foreach ($actor->getPermissions() as $thisPermission) {
            if (substr($thisPermission, 0, 3) === 'tag' && strpos($thisPermission, $permission) !== false) {
                return true;
            }
        }

        return false;
    }
}
