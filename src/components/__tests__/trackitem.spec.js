// shallowMount is used to render a component without rendering its child components, while mount will render the component and all child components.
import { shallowMount, RouterLinkStub } from "@vue/test-utils";
import PlaylistItem from "@/components/PlaylistItem.vue";

describe("PlaylistItem.vue", () => {
  it("renders track.display_name", () => {
    const track = {
      display_name: "Test",
    };

    const wrapper = shallowMount(PlaylistItem, {
      props: { track },
      mocks: {
        $t: (message) => message,
      },
      global: {
        stubs: { RouterLink: RouterLinkStub, vIcon: true },
      },
    });

    const trackAuthor = wrapper.find(".text-gray-500");
    expect(trackAuthor.text()).toBe(track.display_name);
  });
});
