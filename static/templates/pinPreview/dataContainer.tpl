<table class="table">
    <thead>
        <tr>
            <th scope="col">[[pindealbee:data-container-topic-id]]</th>
            <th scope="col">[[pindealbee:data-container-category]]</th>
            <th scope="col">[[pindealbee:data-container-title]]</th>
            <th scope="col">[[pindealbee:data-container-view]]</th>
            <th scope="col">[[pindealbee:data-container-upvote]]</th>
            <th scope="col">[[pindealbee:data-container-time-created]]</th>
            <th scope="col">[[pindealbee:data-container-time-modified]]</th>
            <th scope="col"></th>
        </tr>
    </thead>
    <tbody>
        <!-- BEGIN topics -->
        <tr>
            <td>{topics.tid}</td>
            <td>{topics.category.name}</td>
            <td>
                <a href="/topic/{topics.tid}" target="_blank">
                    <strong>
                        {topics.title}
                    </strong>
                </a>
            </td>
            <td>{topics.viewcount}</td>
            <td>{topics.upvotes}</td>
            <td>{topics.timestampISOFormat}</td>
            <td>{topics.lastposttimeISOFormat}</td>
            <td>
                <button class="btn btn-primary btn-pin" data-tid={topics.tid} data-category="{topics.category.name}" data-title="{topics.title}">
                    <i class="fa fa-1x fa-thumb-tack"></i>
                </button>
            </td>
        </tr>
        <!-- END topics -->
    </tbody>
</table>